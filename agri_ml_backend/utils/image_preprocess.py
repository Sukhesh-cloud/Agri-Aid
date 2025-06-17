from PIL import Image
import numpy as np

def preprocess_image(image_file, target_size=(124, 124)):
    image = Image.open(image_file).convert("RGB")
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)
