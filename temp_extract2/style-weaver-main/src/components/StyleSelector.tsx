import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface StylePreset {
  id: string;
  label: string;
  prompt: string;
}

interface StyleCategory {
  id: string;
  label: string;
  emoji: string;
  presets: StylePreset[];
}

const styleCategories: StyleCategory[] = [
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

interface StyleSelectorProps {
  selectedPreset: string | null;
  onSelectPreset: (id: string, prompt: string) => void;
  customPrompt: string;
  onCustomPromptChange: (value: string) => void;
}

const StyleSelector = ({ selectedPreset, onSelectPreset, customPrompt, onCustomPromptChange }: StyleSelectorProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Category Accordion */}
      <div className="space-y-2">
        {styleCategories.map((category) => (
          <div key={category.id} className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 transition-all duration-200",
                expandedCategory === category.id
                  ? "bg-primary/10 border-b border-border"
                  : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.emoji}</span>
                <span className="font-medium text-foreground">{category.label}</span>
                <span className="text-xs text-muted-foreground">({category.presets.length} styles)</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  expandedCategory === category.id && "rotate-180"
                )}
              />
            </button>

            {expandedCategory === category.id && (
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {category.presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset.id, preset.prompt)}
                    className={cn(
                      "p-3 rounded-md text-left text-sm transition-all duration-150",
                      selectedPreset === preset.id
                        ? "bg-primary/20 border border-primary shadow-glow text-foreground font-medium"
                        : "bg-muted/50 border border-transparent hover:border-primary/30 hover:bg-muted text-secondary-foreground"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom prompt */}
      <div className="relative">
        <textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder="Or describe your own style... e.g., 'White linen suit with gold accessories on a beach'"
          className="w-full min-h-[80px] rounded-lg bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-glow resize-none transition-all"
        />
      </div>
    </div>
  );
};

export default StyleSelector;
