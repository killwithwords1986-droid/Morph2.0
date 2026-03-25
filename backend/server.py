from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class RestyleRequest(BaseModel):
    imageBase64: str
    stylePrompt: str
    gender: str = "both"  # male, female, or both

class RestyleResponse(BaseModel):
    image: Optional[str] = None
    description: Optional[str] = None
    error: Optional[str] = None
    id: Optional[str] = None

class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    original_image: str
    generated_image: str
    style_prompt: str
    gender: str = "both"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryItemCreate(BaseModel):
    original_image: str
    generated_image: str
    style_prompt: str
    gender: str = "both"

class GalleryItemResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    original_image: str
    generated_image: str
    style_prompt: str
    gender: str
    created_at: str

class FavoriteStyle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    body_styles: List[str] = []  # List of style IDs
    hair_styles: List[str] = []  # List of style IDs
    custom_prompt: str = ""
    gender: str = "both"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FavoriteStyleCreate(BaseModel):
    name: str
    body_styles: List[str] = []
    hair_styles: List[str] = []
    custom_prompt: str = ""
    gender: str = "both"

class FavoriteStyleResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    body_styles: List[str]
    hair_styles: List[str]
    custom_prompt: str
    gender: str
    created_at: str

# Prompt template for restyling with gender
def get_restyle_prompt(style_prompt: str, gender: str) -> str:
    gender_text = ""
    if gender == "male":
        gender_text = "This is a male subject. Use masculine versions of all clothing and styling. "
    elif gender == "female":
        gender_text = "This is a female subject. Use feminine versions of all clothing and styling. "
    else:
        gender_text = "Style appropriately for the subject's apparent gender. "
    
    return f"""{gender_text}Using this person's likeness (face and general appearance), generate a new photorealistic image of them styled as follows: {style_prompt}. You may change the pose, outfit, accessories, hairstyle, setting, and camera angle as needed to match the description. Make it look like high fashion editorial photography with professional lighting. The result MUST be a generated image."""

@api_router.get("/")
async def root():
    return {"message": "Style Weaver API - MORPH"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.post("/restyle", response_model=RestyleResponse)
async def restyle_image(request: RestyleRequest):
    """Restyle an image using AI image generation"""
    try:
        image_base64 = request.imageBase64
        style_prompt = request.stylePrompt
        gender = request.gender
        
        if not image_base64 or not style_prompt:
            return RestyleResponse(error="Missing imageBase64 or stylePrompt")
        
        # Get API key
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            return RestyleResponse(error="EMERGENT_LLM_KEY is not configured.")
        
        logger.info(f"Starting restyle with prompt: {style_prompt[:50]}... gender: {gender}")
        
        # Extract base64 data if it's a data URL
        if image_base64.startswith("data:"):
            base64_data = image_base64.split(",", 1)[1] if "," in image_base64 else image_base64
        else:
            base64_data = image_base64
        
        # Create unique session ID for this request
        session_id = str(uuid.uuid4())
        
        # Initialize the chat with Gemini image model
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message="You are a professional fashion stylist and image generation assistant."
        )
        chat.with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])
        
        # Create the message with the image and style prompt
        restyle_prompt = get_restyle_prompt(style_prompt, gender)
        msg = UserMessage(
            text=restyle_prompt,
            file_contents=[ImageContent(base64_data)]
        )
        
        # Send message and get response
        text, images = await chat.send_message_multimodal_response(msg)
        
        logger.info(f"Got response - text length: {len(text) if text else 0}, images: {len(images) if images else 0}")
        
        generation_id = str(uuid.uuid4())
        
        if images and len(images) > 0:
            img = images[0]
            image_data = img.get('data', '')
            mime_type = img.get('mime_type', 'image/png')
            generated_image = f"data:{mime_type};base64,{image_data}"
            
            logger.info("Successfully generated restyled image")
            return RestyleResponse(image=generated_image, description=text, id=generation_id)
        
        # Check if text response contains embedded image
        if text and "data:image" in text:
            import re
            match = re.search(r'(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)', text)
            if match:
                logger.info("Extracted inline image from text response")
                return RestyleResponse(image=match.group(1), description=text, id=generation_id)
        
        logger.warning("No image generated in response")
        return RestyleResponse(error="No image was generated. Please try again with a different style.")
        
    except Exception as e:
        logger.error(f"Restyle error: {str(e)}")
        return RestyleResponse(error=str(e))

# Gallery endpoints
@api_router.post("/gallery", response_model=GalleryItemResponse)
async def save_to_gallery(item: GalleryItemCreate):
    """Save a generated image to the gallery"""
    try:
        gallery_item = GalleryItem(
            original_image=item.original_image,
            generated_image=item.generated_image,
            style_prompt=item.style_prompt,
            gender=item.gender
        )
        
        doc = gallery_item.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.gallery.insert_one(doc)
        
        return GalleryItemResponse(
            id=gallery_item.id,
            original_image=gallery_item.original_image,
            generated_image=gallery_item.generated_image,
            style_prompt=gallery_item.style_prompt,
            gender=gallery_item.gender,
            created_at=doc['created_at']
        )
    except Exception as e:
        logger.error(f"Gallery save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/gallery", response_model=List[GalleryItemResponse])
async def get_gallery():
    """Get all gallery items"""
    items = await db.gallery.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return items

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str):
    """Delete a gallery item"""
    result = await db.gallery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Deleted successfully"}

# Favorites endpoints
@api_router.post("/favorites", response_model=FavoriteStyleResponse)
async def save_favorite(fav: FavoriteStyleCreate):
    """Save a favorite style combination"""
    try:
        favorite = FavoriteStyle(
            name=fav.name,
            body_styles=fav.body_styles,
            hair_styles=fav.hair_styles,
            custom_prompt=fav.custom_prompt,
            gender=fav.gender
        )
        doc = favorite.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.favorites.insert_one(doc)
        return FavoriteStyleResponse(
            id=favorite.id,
            name=favorite.name,
            body_styles=favorite.body_styles,
            hair_styles=favorite.hair_styles,
            custom_prompt=favorite.custom_prompt,
            gender=favorite.gender,
            created_at=doc['created_at']
        )
    except Exception as e:
        logger.error(f"Favorite save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/favorites", response_model=List[FavoriteStyleResponse])
async def get_favorites():
    """Get all saved favorites"""
    items = await db.favorites.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return items

@api_router.delete("/favorites/{fav_id}")
async def delete_favorite(fav_id: str):
    """Delete a favorite"""
    result = await db.favorites.delete_one({"id": fav_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
