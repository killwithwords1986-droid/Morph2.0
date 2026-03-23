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

class RestyleResponse(BaseModel):
    image: Optional[str] = None
    description: Optional[str] = None
    error: Optional[str] = None

class Generation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    style_prompt: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "completed"

# Prompt template for restyling
def get_restyle_prompt(style_prompt: str) -> str:
    return f"""Using this person's likeness (face and general appearance), generate a new photorealistic image of them styled as follows: {style_prompt}. You may change the pose, outfit, accessories, hairstyle, setting, and camera angle as needed to match the description. Make it look like high fashion editorial photography with professional lighting. The result MUST be a generated image."""

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
        
        if not image_base64 or not style_prompt:
            return RestyleResponse(error="Missing imageBase64 or stylePrompt")
        
        # Get API key
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            return RestyleResponse(error="EMERGENT_LLM_KEY is not configured.")
        
        logger.info(f"Starting restyle with prompt: {style_prompt[:50]}...")
        
        # Extract base64 data if it's a data URL
        if image_base64.startswith("data:"):
            # Extract the base64 part after the comma
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
        restyle_prompt = get_restyle_prompt(style_prompt)
        msg = UserMessage(
            text=restyle_prompt,
            file_contents=[ImageContent(base64_data)]
        )
        
        # Send message and get response
        text, images = await chat.send_message_multimodal_response(msg)
        
        logger.info(f"Got response - text length: {len(text) if text else 0}, images: {len(images) if images else 0}")
        
        if images and len(images) > 0:
            # Get the first generated image
            img = images[0]
            image_data = img.get('data', '')
            mime_type = img.get('mime_type', 'image/png')
            
            # Create data URL from base64
            generated_image = f"data:{mime_type};base64,{image_data}"
            
            logger.info("Successfully generated restyled image")
            
            # Save generation to database
            gen = Generation(style_prompt=style_prompt)
            gen_doc = gen.model_dump()
            gen_doc['created_at'] = gen_doc['created_at'].isoformat()
            await db.generations.insert_one(gen_doc)
            
            return RestyleResponse(image=generated_image, description=text)
        
        # Check if text response contains embedded image
        if text and "data:image" in text:
            import re
            match = re.search(r'(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)', text)
            if match:
                logger.info("Extracted inline image from text response")
                return RestyleResponse(image=match.group(1), description=text)
        
        logger.warning("No image generated in response")
        return RestyleResponse(error="No image was generated. Please try again with a different style.")
        
    except Exception as e:
        logger.error(f"Restyle error: {str(e)}")
        return RestyleResponse(error=str(e))

@api_router.get("/generations", response_model=List[Generation])
async def get_generations():
    """Get recent generations"""
    generations = await db.generations.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    for gen in generations:
        if isinstance(gen['created_at'], str):
            gen['created_at'] = datetime.fromisoformat(gen['created_at'])
    return generations

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
