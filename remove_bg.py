from PIL import Image
import numpy as np

def remove_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # Threshold for "black" or "dark" background
    # We want to keep the bright Neon Pink and Neon Green.
    # Pink is roughly (255, 20, 147), Green is (0, 255, 0).
    # Background is black (0,0,0) or dark gray.
    
    for item in datas:
        # Check for black/dark pixels
        # If R, G, and B are all low, it's background
        if item[0] < 50 and item[1] < 50 and item[2] < 50:
            newData.append((0, 0, 0, 0))  # Transparent
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Optional: Trim empty space
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

input_file = "/Users/jbxjbx/.gemini/antigravity/brain/01cd112f-0a7e-4113-bd9a-379c4cee65b2/uploaded_image_1767990313128.png"
output_file = "/Users/jbxjbx/Desktop/Nourish Select/webpage development/public/logo.png"

remove_background(input_file, output_file)
