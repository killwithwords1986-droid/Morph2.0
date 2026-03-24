import React, { useState, useCallback, useRef, useEffect } from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Sparkles, Upload, X, ChevronDown, Camera, Download, Share2, Plus, Trash2, Scissors, Image, User, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============================================
// FULL BODY STYLE CATEGORIES - 10 categories x 20 presets = 200 styles
// ============================================
const styleCategories = [
  {
    id: "sporty",
    label: "Sporty",
    emoji: "🏃",
    presets: [
      { id: "sporty-tracksuit", label: "Modern Tracksuit", prompt: "wearing a modern tracksuit, fresh sneakers, sporty streetwear aesthetic" },
      { id: "sporty-jogger", label: "Jogger Set", prompt: "wearing slim-fit joggers, performance hoodie, running shoes, athleisure look" },
      { id: "sporty-tennis", label: "Tennis Chic", prompt: "wearing a white tennis skirt or shorts, polo shirt, clean white sneakers, tennis club style" },
      { id: "sporty-basketball", label: "Basketball Fit", prompt: "wearing basketball jersey, baggy shorts, high-top sneakers, NBA courtside style" },
      { id: "sporty-cycling", label: "Cycling Kit", prompt: "wearing aerodynamic cycling jersey, padded shorts, sleek cycling shoes, pro cyclist look" },
      { id: "sporty-yoga", label: "Yoga Flow", prompt: "wearing fitted yoga pants, sports bra or tank top, barefoot, serene wellness aesthetic" },
      { id: "sporty-boxing", label: "Boxing Ready", prompt: "wearing boxing shorts, hand wraps, sports tank, boxing gym aesthetic" },
      { id: "sporty-surf", label: "Surf Style", prompt: "wearing a wetsuit top, board shorts, beach-ready sporty surf look" },
      { id: "sporty-ski", label: "Ski Gear", prompt: "wearing sleek ski jacket, snow pants, goggles on head, alpine sport chic" },
      { id: "sporty-retro", label: "Retro Athletic", prompt: "wearing vintage 80s athletic wear, headband, high-cut shorts, retro sneakers" },
      { id: "sporty-golf", label: "Golf Club", prompt: "wearing polo shirt, tailored golf pants, golf shoes, country club sport style" },
      { id: "sporty-martial", label: "Martial Arts", prompt: "wearing a traditional martial arts gi, black belt, dojo training look" },
      { id: "sporty-swim", label: "Swim Team", prompt: "wearing competitive swimwear, swim cap, goggles, Olympic swimmer aesthetic" },
      { id: "sporty-hiking", label: "Trail Hiker", prompt: "wearing hiking boots, cargo pants, moisture-wicking shirt, outdoor adventure sporty look" },
      { id: "sporty-football", label: "Football Kit", prompt: "wearing a football jersey, shorts, cleats, match day football style" },
      { id: "sporty-crossfit", label: "CrossFit", prompt: "wearing CrossFit shorts, muscle tank, lifting shoes, functional fitness look" },
      { id: "sporty-equestrian", label: "Equestrian", prompt: "wearing riding boots, jodhpurs, fitted blazer, equestrian sport chic" },
      { id: "sporty-skateboard", label: "Skate Style", prompt: "wearing oversized graphic tee, baggy cargo pants, skate shoes, skatepark aesthetic" },
      { id: "sporty-dance", label: "Dance Fit", prompt: "wearing dance leotard, leg warmers, ballet flats or dance sneakers, studio look" },
      { id: "sporty-motorsport", label: "Motorsport", prompt: "wearing racing suit, racing gloves, motorsport team branding, Formula 1 pit lane style" },
    ],
  },
  {
    id: "office",
    label: "Professional",
    emoji: "💼",
    presets: [
      { id: "office-tailored", label: "Tailored Suit", prompt: "wearing a perfectly tailored navy suit, polished dress shoes, professional corporate look" },
      { id: "office-power", label: "Power Suit", prompt: "wearing a bold power suit in black, sharp shoulders, stilettos or oxfords, CEO energy" },
      { id: "office-smart", label: "Smart Casual", prompt: "wearing chinos, blazer over a crew-neck sweater, loafers, smart casual office look" },
      { id: "office-creative", label: "Creative Director", prompt: "wearing all-black ensemble, designer glasses, minimalist jewelry, creative agency director" },
      { id: "office-startup", label: "Startup Founder", prompt: "wearing a fitted turtleneck, slim pants, clean sneakers, Silicon Valley tech founder look" },
      { id: "office-banking", label: "Wall Street", prompt: "wearing pinstripe suit, French cuff shirt, cufflinks, power tie, Wall Street banker style" },
      { id: "office-pencil", label: "Pencil Skirt Set", prompt: "wearing a pencil skirt, silk blouse, pointed heels, classic corporate feminine style" },
      { id: "office-preppy", label: "Preppy Office", prompt: "wearing khakis, button-down oxford shirt, blazer, penny loafers, Ivy League office look" },
      { id: "office-minimalist", label: "Minimalist Pro", prompt: "wearing a clean white shirt, tailored black trousers, simple leather belt, minimalist professional" },
      { id: "office-lawyer", label: "Courtroom Ready", prompt: "wearing a dark charcoal suit, white shirt, conservative tie, polished brogues, lawyer look" },
      { id: "office-architect", label: "Architect Chic", prompt: "wearing black turtleneck, round glasses, tailored pants, architectural modernist aesthetic" },
      { id: "office-consultant", label: "Management Consultant", prompt: "wearing a grey suit, pastel shirt, subtle pocket square, consulting firm partner style" },
      { id: "office-professor", label: "Professor", prompt: "wearing tweed blazer with elbow patches, corduroy pants, oxford shoes, academic professor look" },
      { id: "office-editor", label: "Fashion Editor", prompt: "wearing statement glasses, structured coat, designer handbag, fashion magazine editor look" },
      { id: "office-diplomat", label: "Diplomat", prompt: "wearing a double-breasted navy blazer, silk tie, pocket square, diplomatic formal style" },
      { id: "office-doctor", label: "White Coat", prompt: "wearing a crisp white lab coat, stethoscope, professional medical doctor look" },
      { id: "office-realtor", label: "Luxury Realtor", prompt: "wearing fitted blazer, designer watch, luxury car keys, upscale real estate agent style" },
      { id: "office-journalist", label: "Journalist", prompt: "wearing a trench coat, messenger bag, notebook in hand, investigative journalist style" },
      { id: "office-executive", label: "C-Suite Executive", prompt: "wearing bespoke three-piece suit, luxury watch, monogrammed cuffs, Fortune 500 executive" },
      { id: "office-modern", label: "Modern Work", prompt: "wearing relaxed-fit blazer, cropped pants, white sneakers, modern hybrid office style" },
    ],
  },
  {
    id: "bold",
    label: "Sassy & Bold",
    emoji: "🔥",
    presets: [
      { id: "bold-leather", label: "Red Leather", prompt: "wearing a red leather jacket, stylish boots, bold street fashion, night out outfit" },
      { id: "bold-neon", label: "Neon Night", prompt: "wearing neon green outfit, platform boots, glow-in-the-dark accessories, rave fashion" },
      { id: "bold-leopard", label: "Leopard Print", prompt: "wearing head-to-toe leopard print, bold sunglasses, fierce stilettos, animal print fashion" },
      { id: "bold-latex", label: "Latex Look", prompt: "wearing shiny latex pants, cropped top, statement earrings, edgy nightclub fashion" },
      { id: "bold-chains", label: "Chain Heavy", prompt: "wearing heavy gold chains, leather pants, crop top, bold urban street style" },
      { id: "bold-punk", label: "Punk Rock", prompt: "wearing ripped fishnet stockings, combat boots, studded jacket, punk rock concert outfit" },
      { id: "bold-metallica", label: "All Metallic", prompt: "wearing head-to-toe metallic silver outfit, futuristic boots, chrome accessories" },
      { id: "bold-feather", label: "Feather Fantasy", prompt: "wearing a dramatic feather boa, sequined dress, platform heels, showgirl glamour" },
      { id: "bold-cutout", label: "Cut-Out Couture", prompt: "wearing a bold cut-out dress, strappy heels, statement jewelry, daring fashion" },
      { id: "bold-power", label: "Power Red", prompt: "wearing an all-red power outfit, red lips, red heels, commanding presence" },
      { id: "bold-vinyl", label: "Vinyl Vibes", prompt: "wearing vinyl trench coat, knee-high boots, dark sunglasses, Matrix-inspired fashion" },
      { id: "bold-corset", label: "Corset Queen", prompt: "wearing a structured corset top, high-waisted pants, bold earrings, corseted street style" },
      { id: "bold-fringe", label: "Fringe Festival", prompt: "wearing fringe jacket, fringe boots, layered necklaces, festival queen look" },
      { id: "bold-snake", label: "Snakeskin", prompt: "wearing snakeskin print outfit, pointed boots, dark makeup, venomous fashion" },
      { id: "bold-sheer", label: "Sheer Dare", prompt: "wearing sheer mesh top layered, high-waisted leather skirt, bold confidence fashion" },
      { id: "bold-oversized", label: "Oversized Boss", prompt: "wearing dramatically oversized blazer, thigh-high boots, power accessory, boss energy" },
      { id: "bold-monochrome", label: "Hot Pink Total", prompt: "wearing all hot pink monochrome outfit, pink sunglasses, pink boots, Barbie bold" },
      { id: "bold-grunge", label: "Grunge Glam", prompt: "wearing ripped jeans, band tee, flannel tied at waist, combat boots, 90s grunge revival" },
      { id: "bold-sequin", label: "Sequin Storm", prompt: "wearing full sequin jumpsuit, disco ball earrings, platform shoes, Saturday night fever" },
      { id: "bold-western", label: "Western Bold", prompt: "wearing cowboy boots, fringed leather jacket, cowboy hat, bold Western saloon style" },
    ],
  },
  {
    id: "avantgarde",
    label: "Avant-Garde",
    emoji: "🎭",
    presets: [
      { id: "avant-sculptural", label: "Sculptural", prompt: "wearing futuristic sculptural clothing, architectural silhouettes, runway editorial look" },
      { id: "avant-deconstructed", label: "Deconstructed", prompt: "wearing deconstructed garments, asymmetric layers, exposed seams, Comme des Garçons inspired" },
      { id: "avant-origami", label: "Origami", prompt: "wearing origami-folded fabric dress, geometric shapes in clothing, paper-art fashion" },
      { id: "avant-cyber", label: "Cyberpunk", prompt: "wearing cyberpunk outfit, LED accessories, augmented reality visor, neon-lit futuristic fashion" },
      { id: "avant-bubble", label: "Bubble Dress", prompt: "wearing inflated bubble-shaped dress, exaggerated volume, experimental fashion sculpture" },
      { id: "avant-mirror", label: "Mirror Mosaic", prompt: "wearing mirrored mosaic clothing, reflective surfaces, disco ball fashion, light-catching outfit" },
      { id: "avant-drape", label: "Extreme Draping", prompt: "wearing dramatically draped fabric, goddess-like toga styling, flowing avant-garde silhouette" },
      { id: "avant-wire", label: "Wire Frame", prompt: "wearing wire-frame structured clothing, 3D geometric body cage, experimental art fashion" },
      { id: "avant-trash", label: "Upcycled Art", prompt: "wearing fashion made from recycled materials, upcycled couture, eco-avant-garde statement" },
      { id: "avant-glass", label: "Glass Couture", prompt: "wearing transparent glass-like clothing, crystal accessories, ethereal see-through fashion" },
      { id: "avant-biomorphic", label: "Biomorphic", prompt: "wearing organic biomorphic shapes, nature-inspired sculptural clothing, living fashion" },
      { id: "avant-digital", label: "Digital Glitch", prompt: "wearing glitch-art printed clothing, pixelated patterns, digital distortion fashion" },
      { id: "avant-armor", label: "Fashion Armor", prompt: "wearing futuristic fashion armor, metallic plates, warrior couture, battle-ready high fashion" },
      { id: "avant-cocoon", label: "Cocoon Wrap", prompt: "wearing oversized cocoon-shaped coat, enveloping silhouette, transformational fashion" },
      { id: "avant-holographic", label: "Holographic", prompt: "wearing holographic iridescent clothing, rainbow reflections, otherworldly alien fashion" },
      { id: "avant-brutalist", label: "Brutalist Fashion", prompt: "wearing raw concrete-inspired textures, stark geometric clothing, brutalist architecture fashion" },
      { id: "avant-kinetic", label: "Kinetic Wear", prompt: "wearing clothing with moving parts, kinetic fashion elements, motion-reactive garments" },
      { id: "avant-void", label: "Void Black", prompt: "wearing impossibly black vantablack clothing, absence of light fashion, void aesthetic" },
      { id: "avant-botanical", label: "Botanical Couture", prompt: "wearing clothing made of living flowers and plants, botanical garden fashion, nature couture" },
      { id: "avant-surreal", label: "Surrealist", prompt: "wearing Dalí-inspired surrealist fashion, melting clock accessories, dream-logic clothing" },
    ],
  },
  {
    id: "casual",
    label: "Casual Cool",
    emoji: "😎",
    presets: [
      { id: "casual-denim", label: "Denim Days", prompt: "wearing relaxed denim, vintage tee, casual effortless cool style" },
      { id: "casual-beach", label: "Beach Vibes", prompt: "wearing linen shorts, open Hawaiian shirt, sandals, beach vacation casual" },
      { id: "casual-cozy", label: "Cozy Knit", prompt: "wearing oversized knit sweater, leggings, fuzzy socks, cozy autumn look" },
      { id: "casual-streetwear", label: "Streetwear", prompt: "wearing oversized hoodie, cargo pants, chunky sneakers, urban streetwear style" },
      { id: "casual-brunch", label: "Brunch Date", prompt: "wearing sundress or casual button-up, white sneakers, tote bag, weekend brunch style" },
      { id: "casual-skater", label: "Skater Chill", prompt: "wearing graphic tee, Dickies pants, Vans shoes, laid-back skater aesthetic" },
      { id: "casual-cottagecore", label: "Cottagecore", prompt: "wearing floral midi dress, straw hat, wicker basket, rustic countryside cottagecore" },
      { id: "casual-minimal", label: "Minimal Casual", prompt: "wearing plain white tee, well-fitted jeans, clean white sneakers, Scandinavian minimal casual" },
      { id: "casual-vintage", label: "Vintage Thrift", prompt: "wearing vintage band tee, mom jeans, retro sunglasses, thrift store cool" },
      { id: "casual-layered", label: "Layered Look", prompt: "wearing layered flannel over tee, cuffed jeans, boots, Pacific Northwest casual" },
      { id: "casual-linen", label: "Linen Ease", prompt: "wearing loose linen pants, linen shirt, leather sandals, Mediterranean casual ease" },
      { id: "casual-normcore", label: "Normcore", prompt: "wearing basic plain clothes, dad jeans, plain tee, New Balance sneakers, anti-fashion normcore" },
      { id: "casual-y2k", label: "Y2K Revival", prompt: "wearing low-rise jeans, baby tee, butterfly clips, platform sandals, early 2000s nostalgia" },
      { id: "casual-boho", label: "Boho Free", prompt: "wearing flowing bohemian skirt, crochet top, layered bracelets, free-spirit boho style" },
      { id: "casual-sporty", label: "Sporty Casual", prompt: "wearing bike shorts, oversized tee, sneakers, sporty-casual hybrid, errands outfit" },
      { id: "casual-festival", label: "Festival Ready", prompt: "wearing denim cutoffs, crochet top, ankle boots, festival wristbands, music festival look" },
      { id: "casual-preppy", label: "Preppy Casual", prompt: "wearing polo shirt, chinos, boat shoes, sweater over shoulders, country club casual" },
      { id: "casual-earth", label: "Earth Tones", prompt: "wearing earth-toned outfit, olive pants, terracotta sweater, natural materials, organic casual" },
      { id: "casual-rainy", label: "Rainy Day", prompt: "wearing yellow rain jacket, rubber boots, umbrella, cozy scarf, rainy day outfit" },
      { id: "casual-coffee", label: "Coffee Run", prompt: "wearing oversized cardigan, leggings, UGG boots, messy bun look, coffee shop casual" },
    ],
  },
  {
    id: "elegant",
    label: "Black Tie",
    emoji: "✨",
    presets: [
      { id: "elegant-gown", label: "Evening Gown", prompt: "wearing an elegant floor-length evening gown, luxurious formal attire, red carpet ready" },
      { id: "elegant-tuxedo", label: "Classic Tuxedo", prompt: "wearing a classic black tuxedo, bow tie, patent leather shoes, James Bond gala style" },
      { id: "elegant-velvet", label: "Velvet Luxe", prompt: "wearing deep burgundy velvet suit or gown, gold accessories, old-money luxury" },
      { id: "elegant-crystal", label: "Crystal Embellished", prompt: "wearing a crystal-embellished gown, sparkling jewelry, diamond earrings, awards ceremony look" },
      { id: "elegant-cape", label: "Cape Drama", prompt: "wearing an elegant cape gown, dramatic train, statement necklace, royal gala entrance" },
      { id: "elegant-satin", label: "Satin Slip", prompt: "wearing a satin slip dress, delicate chain necklace, strappy heels, understated elegance" },
      { id: "elegant-white", label: "White Tie", prompt: "wearing white tie formal wear, tailcoat, white waistcoat, opera-length gloves, ultimate formality" },
      { id: "elegant-mermaid", label: "Mermaid Gown", prompt: "wearing a fitted mermaid silhouette gown, dramatic flare, old Hollywood glamour" },
      { id: "elegant-royal", label: "Royal Court", prompt: "wearing regal formal wear, crown or tiara, royal sash, palace ball attire" },
      { id: "elegant-gatsby", label: "Great Gatsby", prompt: "wearing 1920s Art Deco gown, fringe details, long pearl necklaces, Gatsby party style" },
      { id: "elegant-opera", label: "Opera Night", prompt: "wearing a dramatic opera coat, silk evening dress, chandelier earrings, opera house elegance" },
      { id: "elegant-champagne", label: "Champagne Toast", prompt: "wearing champagne-colored sequin dress, delicate jewelry, champagne glass, New Year's Eve gala" },
      { id: "elegant-midnight", label: "Midnight Blue", prompt: "wearing midnight blue floor-length gown, silver accessories, starlight-inspired elegance" },
      { id: "elegant-ballroom", label: "Ballroom", prompt: "wearing a grand ballroom gown, full skirt, elbow gloves, Cinderella ball aesthetic" },
      { id: "elegant-minimalist", label: "Minimal Formal", prompt: "wearing a clean-cut minimalist gown, no embellishments, architectural design, modern formal" },
      { id: "elegant-vintage", label: "Vintage Formal", prompt: "wearing vintage 1950s formal dress, pearls, victory rolls hairstyle, classic Hollywood" },
      { id: "elegant-emerald", label: "Emerald Night", prompt: "wearing an emerald green silk gown, gold clutch, emerald jewelry, luxury gala night" },
      { id: "elegant-lace", label: "Lace Noir", prompt: "wearing a black lace gown, dramatic sleeves, dark romance formal style" },
      { id: "elegant-metallic", label: "Gold Metallic", prompt: "wearing a liquid gold metallic gown, statement cuff, gold heels, Oscars red carpet" },
      { id: "elegant-italian", label: "Italian Soirée", prompt: "wearing a Valentino-inspired red gown, Italian luxury accessories, Milan fashion gala" },
    ],
  },
  {
    id: "cultural",
    label: "Cultural",
    emoji: "🌍",
    presets: [
      { id: "cultural-kimono", label: "Japanese Kimono", prompt: "wearing a traditional Japanese kimono with obi sash, wooden geta sandals, elegant Japanese style" },
      { id: "cultural-hanbok", label: "Korean Hanbok", prompt: "wearing a colorful Korean hanbok, jeogori top, flowing chima skirt, traditional Korean elegance" },
      { id: "cultural-sari", label: "Indian Sari", prompt: "wearing a stunning silk sari with gold embroidery, traditional Indian jewelry, bangles" },
      { id: "cultural-dashiki", label: "African Dashiki", prompt: "wearing a vibrant African dashiki, bold patterns, traditional African print fashion" },
      { id: "cultural-cheongsam", label: "Chinese Qipao", prompt: "wearing an elegant Chinese qipao/cheongsam, mandarin collar, silk fabric, traditional Chinese style" },
      { id: "cultural-flamenco", label: "Spanish Flamenco", prompt: "wearing a ruffled flamenco dress, red and black, flower in hair, passionate Spanish style" },
      { id: "cultural-scottish", label: "Scottish Highland", prompt: "wearing a tartan kilt, sporran, knee-high socks, Highland dress, Scottish formal style" },
      { id: "cultural-moroccan", label: "Moroccan Caftan", prompt: "wearing an ornate Moroccan caftan, gold embroidery, traditional North African elegance" },
      { id: "cultural-bavarian", label: "Bavarian Dirndl", prompt: "wearing a traditional Bavarian dirndl or lederhosen, Alpine folk fashion" },
      { id: "cultural-thai", label: "Thai Silk", prompt: "wearing traditional Thai silk outfit, gold accessories, Thai temple-inspired formal wear" },
      { id: "cultural-cowboy", label: "American West", prompt: "wearing classic cowboy hat, leather boots, denim, Western American frontier style" },
      { id: "cultural-viking", label: "Norse Viking", prompt: "wearing Viking-inspired leather armor, fur cloak, Norse jewelry, warrior aesthetic" },
      { id: "cultural-greek", label: "Greek Goddess", prompt: "wearing flowing white Grecian gown, gold laurel crown, sandals, ancient Greek goddess look" },
      { id: "cultural-egyptian", label: "Egyptian Royal", prompt: "wearing ancient Egyptian royal attire, gold collar necklace, kohl eyeliner, pharaoh style" },
      { id: "cultural-samurai", label: "Samurai", prompt: "wearing traditional samurai armor, katana, hakama pants, feudal Japan warrior look" },
      { id: "cultural-bollywood", label: "Bollywood Star", prompt: "wearing glamorous Bollywood lehenga, heavy jewelry, dramatic makeup, Indian cinema star" },
      { id: "cultural-mariachi", label: "Mariachi", prompt: "wearing traditional mariachi charro suit, silver buttons, sombrero, Mexican musical tradition" },
      { id: "cultural-polynesian", label: "Polynesian", prompt: "wearing traditional Polynesian tapa cloth, flower lei, tropical island cultural wear" },
      { id: "cultural-renaissance", label: "Renaissance", prompt: "wearing Renaissance-era clothing, doublet and hose or corset gown, medieval European fashion" },
      { id: "cultural-geisha", label: "Geisha Elegance", prompt: "wearing traditional geisha attire, white face paint, elaborate hair ornaments, Japanese art" },
    ],
  },
  {
    id: "fantasy",
    label: "Fantasy & Cosplay",
    emoji: "⚔️",
    presets: [
      { id: "fantasy-wizard", label: "Wizard", prompt: "wearing flowing wizard robes, pointed hat, magical staff, enchanted forest sorcerer look" },
      { id: "fantasy-elf", label: "Elven Royalty", prompt: "wearing elven royal attire, pointed ears, silver circlet, ethereal forest elf aesthetic" },
      { id: "fantasy-pirate", label: "Pirate Captain", prompt: "wearing pirate captain coat, tricorn hat, sword, sailing ship captain swashbuckler look" },
      { id: "fantasy-steampunk", label: "Steampunk", prompt: "wearing steampunk outfit, brass goggles, clockwork accessories, Victorian industrial fantasy" },
      { id: "fantasy-superhero", label: "Superhero", prompt: "wearing custom superhero suit, cape, mask, comic book hero outfit, dynamic pose ready" },
      { id: "fantasy-vampire", label: "Vampire Lord", prompt: "wearing Victorian vampire attire, high collar cape, gothic jewelry, dark immortal elegance" },
      { id: "fantasy-fairy", label: "Forest Fairy", prompt: "wearing gossamer fairy wings, flower crown, nature-inspired outfit, magical fairy aesthetic" },
      { id: "fantasy-knight", label: "Medieval Knight", prompt: "wearing full plate armor, sword and shield, medieval knight, crusader warrior look" },
      { id: "fantasy-cyborgpunk", label: "Cyborg", prompt: "wearing cybernetic implants, robotic arm, LED eyes, sci-fi cyborg fashion" },
      { id: "fantasy-dragon", label: "Dragon Rider", prompt: "wearing dragon-scale armor, fire-resistant cloak, dragon rider warrior fantasy outfit" },
      { id: "fantasy-witch", label: "Modern Witch", prompt: "wearing modern witch aesthetic, black flowing dress, crystal necklace, dark academia witchcraft" },
      { id: "fantasy-astronaut", label: "Space Explorer", prompt: "wearing futuristic space suit, helmet under arm, NASA-inspired, interstellar explorer look" },
      { id: "fantasy-mermaid", label: "Mermaid", prompt: "wearing shimmering mermaid-inspired outfit, iridescent scales, ocean jewelry, underwater fantasy" },
      { id: "fantasy-jedi", label: "Jedi Master", prompt: "wearing Jedi robes, lightsaber, hooded cloak, Star Wars-inspired force wielder" },
      { id: "fantasy-ninja", label: "Shadow Ninja", prompt: "wearing black ninja outfit, face mask, throwing stars, stealth warrior aesthetic" },
      { id: "fantasy-angel", label: "Celestial Angel", prompt: "wearing white angelic robes, golden wings, halo, celestial divine being fashion" },
      { id: "fantasy-postapoc", label: "Post-Apocalyptic", prompt: "wearing post-apocalyptic survivor gear, gas mask, leather armor, wasteland warrior" },
      { id: "fantasy-alien", label: "Alien Ambassador", prompt: "wearing otherworldly alien fashion, iridescent skin-tight suit, holographic accessories, extraterrestrial" },
      { id: "fantasy-time", label: "Time Traveler", prompt: "wearing a mix of era clothing, pocket watch, temporal displacement Victorian-meets-future outfit" },
      { id: "fantasy-demon", label: "Demon King", prompt: "wearing dark demon lord attire, horned crown, black and crimson robes, infernal royalty" },
    ],
  },
  {
    id: "decade",
    label: "Decades",
    emoji: "📻",
    presets: [
      { id: "decade-20s", label: "Roaring 20s", prompt: "wearing 1920s flapper dress, Art Deco headband, fringe, jazz age style, Great Gatsby era" },
      { id: "decade-30s", label: "1930s Glamour", prompt: "wearing 1930s bias-cut silk gown, finger waves hair, Old Hollywood golden era glamour" },
      { id: "decade-40s", label: "1940s Wartime", prompt: "wearing 1940s wartime fashion, victory rolls, A-line skirt, utility chic, pin-up style" },
      { id: "decade-50s", label: "1950s Rock & Roll", prompt: "wearing 1950s poodle skirt, saddle shoes, letterman jacket, American Graffiti rock and roll" },
      { id: "decade-60s", label: "Swinging 60s", prompt: "wearing 1960s mod fashion, mini skirt, go-go boots, geometric prints, Twiggy-inspired" },
      { id: "decade-70s", label: "Groovy 70s", prompt: "wearing 1970s bell-bottoms, platform shoes, psychedelic print shirt, disco fever style" },
      { id: "decade-80s", label: "Neon 80s", prompt: "wearing 1980s neon colors, shoulder pads, leg warmers, big hair, MTV era fashion" },
      { id: "decade-90s", label: "Grunge 90s", prompt: "wearing 1990s grunge flannel, ripped jeans, Doc Martens, choker necklace, alternative 90s" },
      { id: "decade-y2k", label: "Y2K 2000s", prompt: "wearing early 2000s low-rise jeans, bedazzled top, Juicy Couture tracksuit, Y2K pop star" },
      { id: "decade-2010s", label: "2010s Hipster", prompt: "wearing 2010s hipster fashion, skinny jeans, beanie, flannel, craft coffee aesthetic" },
      { id: "decade-victorian", label: "Victorian Era", prompt: "wearing Victorian-era clothing, corset, bustle skirt, top hat, 19th century English fashion" },
      { id: "decade-edwardian", label: "Edwardian", prompt: "wearing Edwardian era clothing, high lace collar, long skirt, parasol, Gibson girl style" },
      { id: "decade-medieval", label: "Medieval", prompt: "wearing medieval clothing, tunic, leather belt, boots, peasant or noble medieval attire" },
      { id: "decade-regency", label: "Regency Era", prompt: "wearing Regency era empire waist gown, Bridgerton-inspired, Austen-era fashion" },
      { id: "decade-belle", label: "Belle Époque", prompt: "wearing Belle Époque fashion, elaborate hat, fitted bodice, Parisian 1890s elegance" },
      { id: "decade-disco", label: "Studio 54", prompt: "wearing Studio 54 disco outfit, sequin halter, bell-bottom jumpsuit, disco ball glamour" },
      { id: "decade-new-wave", label: "New Wave", prompt: "wearing 1980s New Wave fashion, asymmetric hair, skinny tie, synthesizer era style" },
      { id: "decade-beatnik", label: "Beatnik", prompt: "wearing 1950s beatnik style, black turtleneck, beret, sunglasses, coffee house poet look" },
      { id: "decade-hippie", label: "Hippie", prompt: "wearing 1960s hippie fashion, tie-dye, peace symbols, flower crown, Woodstock festival" },
      { id: "decade-future", label: "2050 Future", prompt: "wearing futuristic 2050 fashion, smart fabrics, holographic patterns, AI-designed clothing" },
    ],
  },
  {
    id: "luxury",
    label: "Luxury & Designer",
    emoji: "👑",
    presets: [
      { id: "luxury-chanel", label: "Chanel Classic", prompt: "wearing classic Chanel tweed suit, pearl necklace, quilted handbag, Parisian luxury" },
      { id: "luxury-versace", label: "Versace Bold", prompt: "wearing bold Versace-inspired baroque print, gold Medusa accessories, Italian luxury" },
      { id: "luxury-gucci", label: "Gucci Eclectic", prompt: "wearing eclectic Gucci-inspired mix of patterns, retro glasses, maximalist luxury fashion" },
      { id: "luxury-dior", label: "Dior Couture", prompt: "wearing Dior-inspired new look, cinched waist, full skirt, elegant hat, Parisian couture" },
      { id: "luxury-prada", label: "Prada Minimal", prompt: "wearing Prada-inspired minimalist fashion, clean lines, nylon accessories, intellectual luxury" },
      { id: "luxury-ysl", label: "YSL Tuxedo", prompt: "wearing Saint Laurent-inspired Le Smoking tuxedo, androgynous luxury, Parisian night style" },
      { id: "luxury-hermes", label: "Hermès Equestrian", prompt: "wearing Hermès-inspired equestrian style, silk scarf, leather riding boots, understated luxury" },
      { id: "luxury-burberry", label: "Burberry Check", prompt: "wearing Burberry-inspired trench coat, check pattern scarf, British heritage luxury" },
      { id: "luxury-balenciaga", label: "Balenciaga Volume", prompt: "wearing Balenciaga-inspired oversized silhouettes, chunky sneakers, avant-garde luxury streetwear" },
      { id: "luxury-lv", label: "Louis Vuitton", prompt: "wearing Louis Vuitton-inspired monogram outfit, trunk bag, luxury travel fashion" },
      { id: "luxury-valentino", label: "Valentino Red", prompt: "wearing Valentino-inspired all-red outfit, romantic ruffles, rockstud accessories" },
      { id: "luxury-fendi", label: "Fendi Fur", prompt: "wearing Fendi-inspired faux fur coat, FF logo accessories, Italian luxury playfulness" },
      { id: "luxury-bottega", label: "Bottega Veneta", prompt: "wearing Bottega Veneta-inspired woven leather, muted green, quiet luxury aesthetic" },
      { id: "luxury-tom-ford", label: "Tom Ford Glam", prompt: "wearing Tom Ford-inspired sharp suit, oversized sunglasses, Hollywood glamour luxury" },
      { id: "luxury-armani", label: "Armani Sleek", prompt: "wearing Giorgio Armani-inspired fluid suits, muted tones, Italian elegance luxury" },
      { id: "luxury-givenchy", label: "Givenchy Dark", prompt: "wearing Givenchy-inspired dark romantic fashion, structured shoulders, Gothic luxury" },
      { id: "luxury-celine", label: "Céline Clean", prompt: "wearing Céline-inspired clean minimalism, neutral tones, luxury basics, quiet sophistication" },
      { id: "luxury-mcqueen", label: "McQueen Drama", prompt: "wearing Alexander McQueen-inspired dramatic fashion, skull motifs, dark couture, theatrical luxury" },
      { id: "luxury-cartier", label: "Cartier Jewels", prompt: "wearing dripping in Cartier-inspired jewelry, diamond necklace, luxury watches, opulent accessorizing" },
      { id: "luxury-old-money", label: "Old Money", prompt: "wearing old money quiet luxury, cashmere sweater, loafers, understated wealth, generational richness" },
    ],
  },
];

// ============================================
// HAIR STYLE CATEGORIES - 10 categories x 20 presets = 200 hair styles
// ============================================
const hairCategories = [
  {
    id: "hair-short",
    label: "Short Cuts",
    emoji: "✂️",
    presets: [
      { id: "hair-pixie", label: "Classic Pixie", prompt: "with a classic pixie cut, short and chic, effortlessly stylish" },
      { id: "hair-buzz", label: "Buzz Cut", prompt: "with a fresh buzz cut, clean and bold, military precision" },
      { id: "hair-fade", label: "Skin Fade", prompt: "with a sharp skin fade, tapered sides, modern barbershop style" },
      { id: "hair-undercut", label: "Undercut", prompt: "with an edgy undercut, shaved sides, longer on top" },
      { id: "hair-crew", label: "Crew Cut", prompt: "with a classic crew cut, short and professional, timeless style" },
      { id: "hair-caesar", label: "Caesar Cut", prompt: "with a Caesar cut, short bangs, textured top" },
      { id: "hair-french-crop", label: "French Crop", prompt: "with a French crop, textured fringe, clean sides" },
      { id: "hair-quiff-short", label: "Short Quiff", prompt: "with a short quiff, volume on top, styled back" },
      { id: "hair-textured-crop", label: "Textured Crop", prompt: "with a textured crop, messy styling, modern look" },
      { id: "hair-bowl", label: "Modern Bowl", prompt: "with a modern bowl cut, rounded shape, fashion-forward" },
      { id: "hair-ivy-league", label: "Ivy League", prompt: "with an Ivy League cut, side part, collegiate style" },
      { id: "hair-butch", label: "Butch Cut", prompt: "with a butch cut, uniform length, low maintenance" },
      { id: "hair-high-top", label: "High Top Fade", prompt: "with a high top fade, flat top, 90s hip hop style" },
      { id: "hair-tapered", label: "Tapered Cut", prompt: "with a tapered cut, gradual fade, versatile style" },
      { id: "hair-disconnected", label: "Disconnected Cut", prompt: "with a disconnected undercut, dramatic contrast" },
      { id: "hair-spiky", label: "Spiky Style", prompt: "with spiky hair, textured and edgy, punk inspired" },
      { id: "hair-messy-short", label: "Messy Short", prompt: "with messy short hair, bedhead style, effortless cool" },
      { id: "hair-slicked-short", label: "Slicked Short", prompt: "with slicked back short hair, polished and neat" },
      { id: "hair-military", label: "Military Cut", prompt: "with a regulation military cut, sharp and disciplined" },
      { id: "hair-asymmetric-short", label: "Asymmetric Short", prompt: "with asymmetric short cut, one side longer, avant-garde" },
    ],
  },
  {
    id: "hair-medium",
    label: "Medium Length",
    emoji: "💇",
    presets: [
      { id: "hair-lob", label: "Long Bob (Lob)", prompt: "with a stylish lob, shoulder-length, versatile cut" },
      { id: "hair-shag", label: "Shag Cut", prompt: "with a shag haircut, layered and textured, 70s inspired" },
      { id: "hair-curtain", label: "Curtain Bangs", prompt: "with curtain bangs, face-framing layers, retro chic" },
      { id: "hair-wolf", label: "Wolf Cut", prompt: "with a wolf cut, mullet-inspired layers, edgy modern" },
      { id: "hair-layered-medium", label: "Layered Medium", prompt: "with medium layered hair, movement and dimension" },
      { id: "hair-blunt-medium", label: "Blunt Medium", prompt: "with blunt medium length hair, sharp clean lines" },
      { id: "hair-feathered", label: "Feathered Layers", prompt: "with feathered layers, soft and flowing, Farrah Fawcett inspired" },
      { id: "hair-messy-medium", label: "Messy Medium", prompt: "with messy medium hair, tousled beach waves" },
      { id: "hair-side-part-medium", label: "Deep Side Part", prompt: "with a deep side part, old Hollywood glamour" },
      { id: "hair-middle-part", label: "Middle Part", prompt: "with a sleek middle part, modern minimalist" },
      { id: "hair-flipped", label: "Flipped Ends", prompt: "with flipped ends, retro 60s style, bouncy" },
      { id: "hair-choppy", label: "Choppy Layers", prompt: "with choppy layers, edgy and textured, rock star" },
      { id: "hair-beachy", label: "Beach Waves", prompt: "with effortless beach waves, sun-kissed casual" },
      { id: "hair-straight-medium", label: "Sleek Straight", prompt: "with sleek straight medium hair, polished shine" },
      { id: "hair-voluminous", label: "Voluminous Blowout", prompt: "with a voluminous blowout, bouncy and full" },
      { id: "hair-natural-medium", label: "Natural Texture", prompt: "with natural texture medium length, embracing curls" },
      { id: "hair-face-frame", label: "Face Framing", prompt: "with face-framing layers, highlighting features" },
      { id: "hair-90s-flip", label: "90s Flip", prompt: "with 90s flip out style, ends flipped outward" },
      { id: "hair-italian-bob", label: "Italian Bob", prompt: "with an Italian bob, chin-length, sophisticated" },
      { id: "hair-butterfly", label: "Butterfly Cut", prompt: "with a butterfly cut, lots of layers, volume at crown" },
    ],
  },
  {
    id: "hair-long",
    label: "Long Styles",
    emoji: "👸",
    presets: [
      { id: "hair-mermaid", label: "Mermaid Waves", prompt: "with long mermaid waves, flowing and ethereal" },
      { id: "hair-straight-long", label: "Sleek & Straight", prompt: "with long sleek straight hair, glass-like shine" },
      { id: "hair-layers-long", label: "Long Layers", prompt: "with long layered hair, movement and dimension" },
      { id: "hair-rapunzel", label: "Rapunzel Length", prompt: "with ultra-long Rapunzel hair, fairy tale length" },
      { id: "hair-v-cut", label: "V-Cut Long", prompt: "with a V-cut long style, dramatic back shape" },
      { id: "hair-u-cut", label: "U-Cut Long", prompt: "with a U-cut long style, rounded back shape" },
      { id: "hair-blunt-long", label: "Blunt Long", prompt: "with blunt cut long hair, one length, powerful" },
      { id: "hair-waterfall", label: "Waterfall Waves", prompt: "with waterfall waves, cascading curls" },
      { id: "hair-bombshell", label: "Bombshell Curls", prompt: "with bombshell curls, old Hollywood glamour" },
      { id: "hair-bohemian", label: "Bohemian Long", prompt: "with bohemian long hair, free-spirited waves" },
      { id: "hair-goddess", label: "Goddess Waves", prompt: "with goddess waves, ethereal and romantic" },
      { id: "hair-vintage-long", label: "Vintage Waves", prompt: "with vintage finger waves, 1920s glamour" },
      { id: "hair-windswept", label: "Windswept", prompt: "with windswept long hair, natural movement" },
      { id: "hair-princess", label: "Princess Style", prompt: "with princess-style long hair, flowing and regal" },
      { id: "hair-hippie", label: "Hippie Long", prompt: "with hippie-length hair, natural and free" },
      { id: "hair-crystal", label: "Crystal Straight", prompt: "with crystal straight long hair, mirror-like" },
      { id: "hair-romantic", label: "Romantic Curls", prompt: "with romantic soft curls, dreamy and feminine" },
      { id: "hair-wild-long", label: "Wild & Free", prompt: "with wild long hair, untamed natural beauty" },
      { id: "hair-silk", label: "Silk Press", prompt: "with silk press long hair, smooth and flowing" },
      { id: "hair-mane", label: "Lion Mane", prompt: "with a lion mane, big voluminous long hair" },
    ],
  },
  {
    id: "hair-curly",
    label: "Curly & Coily",
    emoji: "🌀",
    presets: [
      { id: "hair-tight-curls", label: "Tight Curls", prompt: "with tight spiral curls, defined ringlets" },
      { id: "hair-loose-curls", label: "Loose Curls", prompt: "with loose bouncy curls, soft and romantic" },
      { id: "hair-afro", label: "Natural Afro", prompt: "with a beautiful natural afro, proud and full" },
      { id: "hair-coils", label: "Coily Texture", prompt: "with coily natural texture, defined coils" },
      { id: "hair-s-wave", label: "S-Wave Pattern", prompt: "with S-wave curl pattern, wavy texture" },
      { id: "hair-corkscrew", label: "Corkscrew Curls", prompt: "with corkscrew curls, tight spirals" },
      { id: "hair-ringlets", label: "Defined Ringlets", prompt: "with defined ringlets, bouncy curls" },
      { id: "hair-wash-go", label: "Wash and Go", prompt: "with wash and go natural curls, effortless" },
      { id: "hair-twist-out", label: "Twist Out", prompt: "with a twist out style, defined waves" },
      { id: "hair-braid-out", label: "Braid Out", prompt: "with a braid out style, crimped waves" },
      { id: "hair-bantu-out", label: "Bantu Knot Out", prompt: "with bantu knot out, defined curl clusters" },
      { id: "hair-finger-coils", label: "Finger Coils", prompt: "with finger coils, individually defined" },
      { id: "hair-stretched", label: "Stretched Curls", prompt: "with stretched curls, elongated spirals" },
      { id: "hair-perm-curls", label: "Perm Curls", prompt: "with perm-style curls, 80s inspired volume" },
      { id: "hair-beach-curls", label: "Beach Curls", prompt: "with natural beach curls, salt-spray texture" },
      { id: "hair-kinky", label: "Kinky Texture", prompt: "with kinky natural texture, tight z-pattern" },
      { id: "hair-fluffy", label: "Fluffy Curls", prompt: "with fluffy voluminous curls, cloud-like" },
      { id: "hair-defined", label: "Super Defined", prompt: "with super defined curls, gel cast" },
      { id: "hair-curly-bangs", label: "Curly Bangs", prompt: "with curly bangs, face-framing curls" },
      { id: "hair-big-curls", label: "Big Bold Curls", prompt: "with big bold curls, statement hair" },
    ],
  },
  {
    id: "hair-updos",
    label: "Updos & Formal",
    emoji: "👰",
    presets: [
      { id: "hair-bun-high", label: "High Bun", prompt: "with a sleek high bun, elegant and polished" },
      { id: "hair-bun-low", label: "Low Bun", prompt: "with a low chignon bun, sophisticated style" },
      { id: "hair-messy-bun", label: "Messy Bun", prompt: "with a messy undone bun, effortlessly chic" },
      { id: "hair-french-twist", label: "French Twist", prompt: "with a classic French twist, timeless elegance" },
      { id: "hair-updo-romantic", label: "Romantic Updo", prompt: "with a romantic loose updo, soft tendrils" },
      { id: "hair-ballerina", label: "Ballerina Bun", prompt: "with a perfect ballerina bun, dancer elegance" },
      { id: "hair-braided-updo", label: "Braided Updo", prompt: "with an intricate braided updo, bohemian bride" },
      { id: "hair-top-knot", label: "Top Knot", prompt: "with a trendy top knot, modern casual" },
      { id: "hair-victory-rolls", label: "Victory Rolls", prompt: "with vintage victory rolls, 1940s glamour" },
      { id: "hair-gibson-tuck", label: "Gibson Tuck", prompt: "with a Gibson tuck, Edwardian elegance" },
      { id: "hair-beehive", label: "Beehive", prompt: "with a classic beehive updo, 60s mod style" },
      { id: "hair-crown-braid", label: "Crown Braid", prompt: "with a crown braid updo, regal style" },
      { id: "hair-half-up", label: "Half Up Half Down", prompt: "with half up half down style, romantic" },
      { id: "hair-twisted-updo", label: "Twisted Updo", prompt: "with twisted sections updo, modern elegant" },
      { id: "hair-side-bun", label: "Side Bun", prompt: "with an elegant side bun, asymmetric beauty" },
      { id: "hair-bridal", label: "Bridal Updo", prompt: "with a stunning bridal updo, wedding ready" },
      { id: "hair-space-buns", label: "Space Buns", prompt: "with fun space buns, playful double buns" },
      { id: "hair-chignon", label: "Classic Chignon", prompt: "with a classic chignon, old Hollywood" },
      { id: "hair-pinned", label: "Pinned Curls", prompt: "with pinned curl updo, vintage glam" },
      { id: "hair-sculptural", label: "Sculptural Updo", prompt: "with a sculptural artistic updo, avant-garde" },
    ],
  },
  {
    id: "hair-braids",
    label: "Braids & Twists",
    emoji: "🎀",
    presets: [
      { id: "hair-box-braids", label: "Box Braids", prompt: "with classic box braids, protective style" },
      { id: "hair-cornrows", label: "Cornrows", prompt: "with sleek cornrows, intricate patterns" },
      { id: "hair-french-braid", label: "French Braid", prompt: "with a classic French braid, timeless" },
      { id: "hair-dutch-braid", label: "Dutch Braid", prompt: "with a Dutch braid, raised pattern" },
      { id: "hair-fishtail", label: "Fishtail Braid", prompt: "with a fishtail braid, intricate weave" },
      { id: "hair-goddess-braids", label: "Goddess Braids", prompt: "with thick goddess braids, regal style" },
      { id: "hair-fulani", label: "Fulani Braids", prompt: "with Fulani braids, beads and accessories" },
      { id: "hair-lemonade", label: "Lemonade Braids", prompt: "with side-swept lemonade braids, Beyoncé inspired" },
      { id: "hair-knotless", label: "Knotless Braids", prompt: "with knotless box braids, seamless start" },
      { id: "hair-passion-twists", label: "Passion Twists", prompt: "with passion twists, bohemian style" },
      { id: "hair-senegalese", label: "Senegalese Twists", prompt: "with Senegalese twists, rope-like" },
      { id: "hair-marley", label: "Marley Twists", prompt: "with Marley twists, natural texture" },
      { id: "hair-havana", label: "Havana Twists", prompt: "with jumbo Havana twists, chunky style" },
      { id: "hair-micro-braids", label: "Micro Braids", prompt: "with tiny micro braids, intricate" },
      { id: "hair-jumbo-braids", label: "Jumbo Braids", prompt: "with jumbo thick braids, bold statement" },
      { id: "hair-waterfall-braid", label: "Waterfall Braid", prompt: "with a waterfall braid, romantic cascading" },
      { id: "hair-halo-braid", label: "Halo Braid", prompt: "with a halo braid, crown-like circle" },
      { id: "hair-tribal-braids", label: "Tribal Braids", prompt: "with tribal pattern braids, cultural style" },
      { id: "hair-feed-in", label: "Feed-In Braids", prompt: "with feed-in braids, natural start" },
      { id: "hair-stitch-braids", label: "Stitch Braids", prompt: "with stitch braids, defined parts" },
    ],
  },
  {
    id: "hair-color",
    label: "Hair Colors",
    emoji: "🎨",
    presets: [
      { id: "hair-platinum", label: "Platinum Blonde", prompt: "with platinum blonde hair, ice queen" },
      { id: "hair-honey", label: "Honey Blonde", prompt: "with warm honey blonde hair, golden tones" },
      { id: "hair-strawberry", label: "Strawberry Blonde", prompt: "with strawberry blonde hair, pink undertones" },
      { id: "hair-jet-black", label: "Jet Black", prompt: "with jet black hair, dramatic and sleek" },
      { id: "hair-auburn", label: "Rich Auburn", prompt: "with rich auburn hair, red-brown warmth" },
      { id: "hair-copper", label: "Copper Red", prompt: "with copper red hair, fiery and bold" },
      { id: "hair-burgundy", label: "Burgundy", prompt: "with deep burgundy hair, wine-colored" },
      { id: "hair-caramel", label: "Caramel Highlights", prompt: "with caramel balayage highlights, sun-kissed" },
      { id: "hair-ash-brown", label: "Ash Brown", prompt: "with cool ash brown hair, muted tones" },
      { id: "hair-chocolate", label: "Chocolate Brown", prompt: "with rich chocolate brown hair, glossy" },
      { id: "hair-silver", label: "Silver Gray", prompt: "with silver gray hair, distinguished and chic" },
      { id: "hair-rose-gold", label: "Rose Gold", prompt: "with rose gold hair, pink metallic tones" },
      { id: "hair-pastel-pink", label: "Pastel Pink", prompt: "with soft pastel pink hair, cotton candy" },
      { id: "hair-lavender", label: "Lavender", prompt: "with lavender purple hair, dreamy and soft" },
      { id: "hair-electric-blue", label: "Electric Blue", prompt: "with electric blue hair, vivid and bold" },
      { id: "hair-emerald", label: "Emerald Green", prompt: "with emerald green hair, jewel toned" },
      { id: "hair-rainbow", label: "Rainbow Hair", prompt: "with rainbow colored hair, multi-colored" },
      { id: "hair-ombre", label: "Ombre Fade", prompt: "with ombre faded hair, dark to light gradient" },
      { id: "hair-peekaboo", label: "Peekaboo Color", prompt: "with peekaboo color underneath, hidden surprise" },
      { id: "hair-split-dye", label: "Split Dye", prompt: "with split dye half and half, two-toned" },
    ],
  },
  {
    id: "hair-retro",
    label: "Retro & Vintage",
    emoji: "📺",
    presets: [
      { id: "hair-marcel", label: "Marcel Waves", prompt: "with marcel waves, 1920s finger waves" },
      { id: "hair-pin-curls", label: "Pin Curls", prompt: "with vintage pin curls, 1940s glamour" },
      { id: "hair-pompadour", label: "Pompadour", prompt: "with a pompadour, rockabilly style" },
      { id: "hair-victory", label: "Victory Rolls", prompt: "with victory rolls, WWII era style" },
      { id: "hair-bouffant", label: "Bouffant", prompt: "with a teased bouffant, 60s volume" },
      { id: "hair-flip-60s", label: "60s Flip", prompt: "with a 60s flip hairstyle, Jackie Kennedy" },
      { id: "hair-farrah", label: "Farrah Fawcett", prompt: "with Farrah Fawcett feathered hair, 70s icon" },
      { id: "hair-disco", label: "Disco Hair", prompt: "with big disco hair, Studio 54 ready" },
      { id: "hair-mullet", label: "Classic Mullet", prompt: "with a classic mullet, business front party back" },
      { id: "hair-jheri-curl", label: "Jheri Curl", prompt: "with jheri curls, glossy 80s style" },
      { id: "hair-crimped", label: "Crimped Hair", prompt: "with crimped hair, 80s texture" },
      { id: "hair-rachel", label: "The Rachel", prompt: "with The Rachel haircut, 90s iconic" },
      { id: "hair-spice", label: "Spice Girls", prompt: "with Spice Girls inspired hair, 90s pop" },
      { id: "hair-madonna", label: "Madonna Style", prompt: "with Madonna-inspired hair, 80s pop icon" },
      { id: "hair-marilyn", label: "Marilyn Monroe", prompt: "with Marilyn Monroe platinum curls" },
      { id: "hair-audrey", label: "Audrey Hepburn", prompt: "with Audrey Hepburn updo, classic elegance" },
      { id: "hair-brigitte", label: "Brigitte Bardot", prompt: "with Brigitte Bardot volume, French bombshell" },
      { id: "hair-twiggy", label: "Twiggy Cut", prompt: "with Twiggy short cut, mod 60s" },
      { id: "hair-cleopatra", label: "Cleopatra Bob", prompt: "with Cleopatra-style blunt bob, Egyptian queen" },
      { id: "hair-geisha", label: "Geisha Style", prompt: "with traditional geisha hairstyle, ornate" },
    ],
  },
  {
    id: "hair-edgy",
    label: "Edgy & Alternative",
    emoji: "🖤",
    presets: [
      { id: "hair-mohawk", label: "Mohawk", prompt: "with a bold mohawk, punk style" },
      { id: "hair-faux-hawk", label: "Faux Hawk", prompt: "with a faux hawk, tapered sides" },
      { id: "hair-shaved-side", label: "Shaved Side", prompt: "with one shaved side, asymmetric edge" },
      { id: "hair-shaved-design", label: "Hair Tattoo", prompt: "with shaved designs, hair art tattoo" },
      { id: "hair-deathhawk", label: "Deathhawk", prompt: "with a deathhawk, goth mohawk" },
      { id: "hair-chelsea", label: "Chelsea Cut", prompt: "with a Chelsea cut, skinhead style" },
      { id: "hair-liberty-spikes", label: "Liberty Spikes", prompt: "with liberty spikes, punk rock" },
      { id: "hair-scene", label: "Scene Hair", prompt: "with scene emo hair, side swept bangs" },
      { id: "hair-anime", label: "Anime Inspired", prompt: "with anime-inspired spiky hair" },
      { id: "hair-cyberpunk", label: "Cyberpunk Style", prompt: "with cyberpunk neon hair, futuristic" },
      { id: "hair-half-shaved", label: "Half Shaved", prompt: "with half head shaved, bold contrast" },
      { id: "hair-rat-tail", label: "Rat Tail", prompt: "with a rat tail, retro alternative" },
      { id: "hair-mullet-modern", label: "Modern Mullet", prompt: "with a modern mullet, trendy twist" },
      { id: "hair-geometric", label: "Geometric Cut", prompt: "with geometric precision cut, angular" },
      { id: "hair-neon-roots", label: "Neon Roots", prompt: "with neon colored roots, vivid contrast" },
      { id: "hair-split-shave", label: "Split Shave", prompt: "with split dye and partial shave" },
      { id: "hair-dreadlock", label: "Dreadlocks", prompt: "with dreadlocks, natural locs" },
      { id: "hair-freeform", label: "Freeform Locs", prompt: "with freeform locs, organic growth" },
      { id: "hair-sisterlocks", label: "Sisterlocks", prompt: "with tiny sisterlocks, micro locs" },
      { id: "hair-viking-shave", label: "Viking Style", prompt: "with Viking-inspired shaved sides, braided top" },
    ],
  },
  {
    id: "hair-texture",
    label: "Texture & Treatments",
    emoji: "✨",
    presets: [
      { id: "hair-silk-press", label: "Silk Press", prompt: "with a silk press, smooth and silky" },
      { id: "hair-blowout", label: "Dominican Blowout", prompt: "with a Dominican blowout, voluminous" },
      { id: "hair-keratin", label: "Keratin Smooth", prompt: "with keratin-treated smooth hair, frizz-free" },
      { id: "hair-japanese", label: "Japanese Straight", prompt: "with Japanese straightened hair, pin straight" },
      { id: "hair-perm-wave", label: "Digital Perm", prompt: "with digital perm waves, natural looking" },
      { id: "hair-body-wave", label: "Body Wave", prompt: "with body wave treatment, soft S-curves" },
      { id: "hair-texturizer", label: "Texturizer", prompt: "with texturized curls, loosened pattern" },
      { id: "hair-relaxed", label: "Relaxed Straight", prompt: "with relaxed straightened hair, smooth" },
      { id: "hair-natural-4c", label: "4C Natural", prompt: "with beautiful 4C natural hair, tight coils" },
      { id: "hair-natural-3c", label: "3C Curls", prompt: "with 3C curl pattern, springy curls" },
      { id: "hair-natural-2c", label: "2C Waves", prompt: "with 2C wave pattern, loose waves" },
      { id: "hair-wet-look", label: "Wet Look", prompt: "with wet look gel styling, glossy" },
      { id: "hair-glass", label: "Glass Hair", prompt: "with glass hair treatment, mirror shine" },
      { id: "hair-velvet", label: "Velvet Texture", prompt: "with velvet soft texture, touchable" },
      { id: "hair-feathery", label: "Feathery Soft", prompt: "with feathery soft texture, airy" },
      { id: "hair-matte", label: "Matte Finish", prompt: "with matte textured finish, no shine" },
      { id: "hair-glossy", label: "High Gloss", prompt: "with high gloss finish, lacquered" },
      { id: "hair-cotton", label: "Cotton Soft", prompt: "with cotton soft natural texture" },
      { id: "hair-chunky", label: "Chunky Texture", prompt: "with chunky textured layers, piece-y" },
      { id: "hair-wispy", label: "Wispy Ends", prompt: "with wispy textured ends, delicate" },
    ],
  },
];

// Toast component
const Toast = ({ message, type, onClose }) => (
  <div className={`toast ${type === 'error' ? 'toast-error' : ''}`}>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-sm">{type === 'error' ? 'Error' : 'Success'}</p>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16} /></button>
    </div>
  </div>
);

// Gender Selector component
const GenderSelector = ({ gender, setGender }) => (
  <div className="gender-selector" data-testid="gender-selector">
    <span className="text-sm text-gray-400 mr-3">Style for:</span>
    <div className="gender-buttons">
      <button 
        className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
        onClick={() => setGender('male')}
        data-testid="gender-male"
      >
        <User size={16} />
        Male
      </button>
      <button 
        className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
        onClick={() => setGender('female')}
        data-testid="gender-female"
      >
        <User size={16} />
        Female
      </button>
      <button 
        className={`gender-btn ${gender === 'both' ? 'active' : ''}`}
        onClick={() => setGender('both')}
        data-testid="gender-both"
      >
        <Users size={16} />
        Auto
      </button>
    </div>
  </div>
);

// ImageUpload component with Camera support
const ImageUpload = ({ onImageSelect, currentImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file.type.startsWith("image/")) return;
    const img = new window.Image();
    img.onload = () => {
      const MAX = 768;
      let w = img.width;
      let h = img.height;
      if (w > MAX || h > MAX) {
        const scale = MAX / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      onImageSelect(dataUrl);
    };
    img.src = URL.createObjectURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (currentImage) {
    return (
      <div className="image-container" data-testid="uploaded-image-container">
        <img src={currentImage} alt="Your uploaded photo" />
        <button onClick={onClear} className="clear-button" data-testid="clear-image-btn"><X size={16} /></button>
      </div>
    );
  }

  return (
    <div className="upload-wrapper">
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        data-testid="image-upload-zone"
      >
        <Upload className="w-10 h-10 text-gray-500 mb-4" />
        <p className="text-white font-medium mb-1">Drop your photo here</p>
        <p className="text-sm text-gray-400">or click to browse</p>
        <p className="text-xs text-gray-500 mt-2">Full-body photos work best</p>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" data-testid="image-input" />
      </label>
      <div className="camera-button-wrapper">
        <button onClick={() => cameraInputRef.current?.click()} className="camera-btn" data-testid="camera-capture-btn">
          <Camera size={20} />
          <span>Take Photo</span>
        </button>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleChange} className="hidden" />
      </div>
    </div>
  );
};

// Selected Styles Chips display
const SelectedStylesChips = ({ selectedStyles, onRemove, onClear }) => {
  if (selectedStyles.length === 0) return null;
  return (
    <div className="selected-styles-container" data-testid="selected-styles-chips">
      <div className="selected-styles-header">
        <span className="text-sm font-medium text-gray-300">Selected Styles ({selectedStyles.length})</span>
        <button onClick={onClear} className="clear-all-btn" data-testid="clear-all-styles"><Trash2 size={14} />Clear All</button>
      </div>
      <div className="selected-styles-chips">
        {selectedStyles.map((style, index) => (
          <div key={`${style.id}-${index}`} className="style-chip" data-testid={`chip-${style.id}`}>
            <span>{style.label}</span>
            <button onClick={() => onRemove(index)} className="chip-remove"><X size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// StyleSelector component with multi-select
const StyleSelector = ({ selectedStyles, onAddStyle, customPrompt, onCustomPromptChange, categories, title, icon }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-sm text-gray-400">{title}</span></div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className={`category-button ${expandedCategory === category.id ? 'active' : ''}`}
              data-testid={`category-${category.id}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.emoji}</span>
                <span className="font-medium">{category.label}</span>
                <span className="text-xs text-gray-400">({category.presets.length} styles)</span>
              </div>
              <ChevronDown className={`chevron-icon ${expandedCategory === category.id ? 'open' : ''}`} size={16} />
            </button>
            {expandedCategory === category.id && (
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {category.presets.map((preset) => {
                  const isSelected = selectedStyles.some(s => s.id === preset.id);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onAddStyle(preset)}
                      className={`preset-button ${isSelected ? 'selected' : ''}`}
                      data-testid={`preset-${preset.id}`}
                    >
                      <span className="flex items-center gap-1">{isSelected && <span className="text-xs">✓</span>}{preset.label}</span>
                      {!isSelected && <Plus size={12} className="opacity-50" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="relative">
        <textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder="Or describe your own style..."
          className="style-textarea"
          data-testid="custom-prompt-input"
        />
      </div>
    </div>
  );
};

// Gallery component
const Gallery = ({ items, onDelete, onSelect, showToast }) => {
  if (items.length === 0) {
    return (
      <div className="gallery-empty">
        <Image size={48} className="text-gray-600 mb-4" />
        <p className="text-gray-400">Your gallery is empty</p>
        <p className="text-sm text-gray-500">Create some styles to see them here!</p>
      </div>
    );
  }

  const handleDownload = (item) => {
    const link = document.createElement('a');
    link.href = item.generated_image;
    link.download = `morph-${item.id.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Image downloaded!", "success");
  };

  return (
    <div className="gallery-grid">
      {items.map((item) => (
        <div key={item.id} className="gallery-item" data-testid={`gallery-item-${item.id}`}>
          <img src={item.generated_image} alt={item.style_prompt} onClick={() => onSelect(item)} />
          <div className="gallery-item-overlay">
            <p className="gallery-item-prompt">{item.style_prompt.slice(0, 50)}...</p>
            <div className="gallery-item-actions">
              <button onClick={() => handleDownload(item)} className="gallery-action-btn" title="Download">
                <Download size={14} />
              </button>
              <button onClick={() => onDelete(item.id)} className="gallery-action-btn delete" title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Index page
const Index = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedBodyStyles, setSelectedBodyStyles] = useState([]);
  const [selectedHairStyles, setSelectedHairStyles] = useState([]);
  const [customBodyPrompt, setCustomBodyPrompt] = useState("");
  const [customHairPrompt, setCustomHairPrompt] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('body');
  const [showComparison, setShowComparison] = useState(false);
  const [gender, setGender] = useState('both');
  const [currentView, setCurrentView] = useState('create'); // 'create' or 'gallery'
  const [galleryItems, setGalleryItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Load gallery on mount
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGalleryItems(response.data);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    }
  };

  const handleAddBodyStyle = (style) => {
    if (!selectedBodyStyles.some(s => s.id === style.id)) {
      setSelectedBodyStyles([...selectedBodyStyles, style]);
    }
  };

  const handleAddHairStyle = (style) => {
    if (!selectedHairStyles.some(s => s.id === style.id)) {
      setSelectedHairStyles([...selectedHairStyles, style]);
    }
  };

  const handleRemoveBodyStyle = (index) => {
    setSelectedBodyStyles(selectedBodyStyles.filter((_, i) => i !== index));
  };

  const handleRemoveHairStyle = (index) => {
    setSelectedHairStyles(selectedHairStyles.filter((_, i) => i !== index));
  };

  const buildPrompt = () => {
    const parts = [];
    selectedBodyStyles.forEach(style => parts.push(style.prompt));
    if (customBodyPrompt.trim()) parts.push(customBodyPrompt.trim());
    selectedHairStyles.forEach(style => parts.push(style.prompt));
    if (customHairPrompt.trim()) parts.push(customHairPrompt.trim());
    return parts.join(', ');
  };

  const activePrompt = buildPrompt();
  const hasSelection = selectedBodyStyles.length > 0 || selectedHairStyles.length > 0 || customBodyPrompt.trim() || customHairPrompt.trim();

  const handleGenerate = async () => {
    if (!uploadedImage || !hasSelection) {
      showToast("Please upload a photo and choose at least one style.", "error");
      return;
    }
    setIsGenerating(true);
    setResultImage(null);
    setShowComparison(false);

    try {
      const response = await axios.post(`${API}/restyle`, {
        imageBase64: uploadedImage,
        stylePrompt: activePrompt,
        gender: gender,
      });
      const data = response.data;
      if (data.error) {
        showToast(data.error, "error");
        return;
      }
      if (data.image) {
        setResultImage(data.image);
        showToast("Your new look is ready!", "success");
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!resultImage || !uploadedImage) return;
    setIsSaving(true);
    try {
      await axios.post(`${API}/gallery`, {
        original_image: uploadedImage,
        generated_image: resultImage,
        style_prompt: activePrompt,
        gender: gender,
      });
      showToast("Saved to your gallery!", "success");
      loadGallery();
    } catch (err) {
      showToast("Failed to save", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `morph-style-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Image downloaded!", "success");
  };

  const handleShare = async () => {
    if (!resultImage) return;
    try {
      // Convert base64 to blob
      const base64Data = resultImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const file = new File([blob], 'morph-style.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My MORPH Style',
          text: 'Check out my AI-generated style from MORPH!',
          files: [file]
        });
        showToast("Shared successfully!", "success");
      } else {
        // Fallback: copy image to clipboard or show message
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          showToast("Image copied to clipboard!", "success");
        } catch {
          showToast("Use the download button to save and share", "info");
        }
      }
    } catch (err) {
      showToast("Download the image to share it", "info");
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    try {
      await axios.delete(`${API}/gallery/${id}`);
      showToast("Deleted from gallery", "success");
      loadGallery();
    } catch (err) {
      showToast("Failed to delete", "error");
    }
  };

  const allSelectedStyles = [...selectedBodyStyles, ...selectedHairStyles];

  return (
    <div className="gradient-dark">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] glass">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              <span className="text-[hsl(var(--primary))]">MORPH</span>
            </h1>
            <p className="text-xs text-gray-400">AI Style Experience</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('create')}
              className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
              data-testid="nav-create"
            >
              <Sparkles size={16} />
              Create
            </button>
            <button
              onClick={() => setCurrentView('gallery')}
              className={`nav-btn ${currentView === 'gallery' ? 'active' : ''}`}
              data-testid="nav-gallery"
            >
              <Image size={16} />
              Gallery
              {galleryItems.length > 0 && <span className="nav-badge">{galleryItems.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {currentView === 'gallery' ? (
        <main className="container py-8">
          <h2 className="text-xl font-display font-semibold mb-6">Your Gallery</h2>
          <Gallery 
            items={galleryItems} 
            onDelete={handleDeleteGalleryItem}
            onSelect={(item) => {
              setResultImage(item.generated_image);
              setUploadedImage(item.original_image);
              setCurrentView('create');
            }}
            showToast={showToast}
          />
        </main>
      ) : (
        <main className="container py-6 md:py-10 space-y-8">
          {/* Step 1: Upload + Gender */}
          <section className="space-y-4 animate-fade-in" data-testid="upload-section">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="step-indicator">1</span>
                <h2 className="text-lg font-display font-semibold">Your Photo</h2>
              </div>
              <GenderSelector gender={gender} setGender={setGender} />
            </div>
            <ImageUpload
              onImageSelect={setUploadedImage}
              currentImage={uploadedImage}
              onClear={() => { setUploadedImage(null); setResultImage(null); setShowComparison(false); }}
            />
          </section>

          {/* Step 2: Style Selection */}
          <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }} data-testid="style-section">
            <div className="flex items-center gap-3">
              <span className="step-indicator">2</span>
              <h2 className="text-lg font-display font-semibold">Choose Your Vibe</h2>
            </div>
            
            <SelectedStylesChips 
              selectedStyles={allSelectedStyles}
              onRemove={(index) => {
                if (index < selectedBodyStyles.length) handleRemoveBodyStyle(index);
                else handleRemoveHairStyle(index - selectedBodyStyles.length);
              }}
              onClear={() => { setSelectedBodyStyles([]); setSelectedHairStyles([]); }}
            />
            
            <div className="tab-buttons" data-testid="style-tabs">
              <button className={`tab-btn ${activeTab === 'body' ? 'active' : ''}`} onClick={() => setActiveTab('body')} data-testid="tab-body">
                <Sparkles size={16} />Body Styles<span className="tab-count">200</span>
              </button>
              <button className={`tab-btn ${activeTab === 'hair' ? 'active' : ''}`} onClick={() => setActiveTab('hair')} data-testid="tab-hair">
                <Scissors size={16} />Hair Styles<span className="tab-count">200</span>
              </button>
            </div>

            {activeTab === 'body' ? (
              <StyleSelector
                selectedStyles={selectedBodyStyles}
                onAddStyle={handleAddBodyStyle}
                customPrompt={customBodyPrompt}
                onCustomPromptChange={setCustomBodyPrompt}
                categories={styleCategories}
                title="10 Categories • 200 Styles"
                icon={<Sparkles size={16} className="text-[hsl(var(--primary))]" />}
              />
            ) : (
              <StyleSelector
                selectedStyles={selectedHairStyles}
                onAddStyle={handleAddHairStyle}
                customPrompt={customHairPrompt}
                onCustomPromptChange={setCustomHairPrompt}
                categories={hairCategories}
                title="10 Categories • 200 Hair Styles"
                icon={<Scissors size={16} className="text-[hsl(var(--primary))]" />}
              />
            )}
          </section>

          {/* Generate button */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || !hasSelection || isGenerating}
              className="btn-gold min-w-[200px]"
              data-testid="generate-btn"
            >
              {isGenerating ? (
                <><span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Generating...</>
              ) : (
                <><Sparkles className="w-5 h-5" />Generate Look</>
              )}
            </button>
          </div>

          {/* Result */}
          {resultImage && (
            <section className="space-y-4 animate-fade-in" data-testid="result-section">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="step-indicator">✓</span>
                  <h2 className="text-lg font-display font-semibold">Your New Look</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {uploadedImage && (
                    <button onClick={() => setShowComparison(!showComparison)} className="action-btn" data-testid="toggle-comparison">
                      {showComparison ? 'Hide Compare' : 'Compare'}
                    </button>
                  )}
                  <button onClick={handleSaveToGallery} disabled={isSaving} className="action-btn save" data-testid="save-gallery-btn">
                    <Image size={16} />{isSaving ? 'Saving...' : 'Save to Gallery'}
                  </button>
                  <button onClick={handleDownload} className="action-btn" data-testid="download-btn">
                    <Download size={16} />Download
                  </button>
                  <button onClick={handleShare} className="action-btn" data-testid="share-btn">
                    <Share2 size={16} />Share
                  </button>
                </div>
              </div>
              
              {showComparison && uploadedImage ? (
                <div className="comparison-view">
                  <div className="comparison-side">
                    <span className="comparison-label">Before</span>
                    <img src={uploadedImage} alt="Before" />
                  </div>
                  <div className="comparison-side">
                    <span className="comparison-label">After</span>
                    <img src={resultImage} alt="After" />
                  </div>
                </div>
              ) : (
                <div className="result-image">
                  <img src={resultImage} alt="AI generated restyle" data-testid="result-image" />
                </div>
              )}
            </section>
          )}
        </main>
      )}

      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
