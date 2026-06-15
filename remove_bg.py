from PIL import Image

def remove_white_bg(img_path, out_path, tolerance=50):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    data = img.getdata()
    new_data = []
    
    for item in data:
        # Check if the pixel is close to white
        if item[0] > 255 - tolerance and item[1] > 255 - tolerance and item[2] > 255 - tolerance:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")

remove_white_bg("/Users/computer2/Vida_Plena/public/vida_plena_logo.jpeg", "/Users/computer2/Vida_Plena/public/vida_plena_logo.png", 30)
