# MORPH (Style Weaver) - PRD

## Original Problem Statement
User wanted to migrate their Style Weaver project from Lovable to Emergent platform. The app allows users to upload photos and use AI to restyle them with different fashion looks. Required integration with Emergent Universal Key for AI image generation.

## Architecture

### Tech Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI Integration**: Emergent Universal Key with Gemini Nano Banana (gemini-3-pro-image-preview)

### Key Components
1. **Image Upload**: Drag-and-drop or click to upload photos (resized to 768px max)
2. **Style Categories**: 8 categories with 8 presets each (64+ total styles)
   - Sporty, Professional, Sassy & Bold, Casual Cool
   - Black Tie, Fantasy & Cosplay, Decades, Luxury & Designer
3. **Custom Prompts**: User can write their own style descriptions
4. **AI Generation**: Uses Gemini model to restyle images

### API Endpoints
- `GET /api/` - Health check
- `POST /api/restyle` - Generate restyled image
- `GET /api/generations` - List generation history

## User Personas
1. **Fashion Enthusiast**: Wants to visualize themselves in different styles
2. **Social Media Creator**: Creates content with different looks
3. **Stylist/Designer**: Explores fashion concepts with clients

## Core Requirements (Static)
- [x] Upload photos with drag-and-drop support
- [x] Pre-built style presets organized by category
- [x] Custom style prompt input
- [x] AI-powered image generation
- [x] Dark theme with gold accents

## What's Been Implemented
- **March 23, 2026**: Initial migration from Lovable to Emergent
  - Migrated frontend from Vite/TypeScript to React.js
  - Built FastAPI backend with MongoDB integration
  - Integrated Emergent Universal Key for AI image generation
  - Created 8 style categories with 64+ presets
  - Implemented dark theme with glass morphism effects

## Prioritized Backlog

### P0 (Critical)
- All core features implemented ✓

### P1 (High Priority)
- Save/download generated images
- User accounts to save favorite styles
- Generation history with thumbnails

### P2 (Medium Priority)
- Share generated images to social media
- Compare before/after side-by-side
- Style mixing (combine multiple presets)
- Mobile-optimized UI improvements

### P3 (Future)
- Style recommendations based on uploaded photo
- Batch processing multiple photos
- API access for third-party integrations

## Next Tasks
1. Add download button for generated images
2. Implement image gallery of past generations
3. Add loading skeleton animations during generation
