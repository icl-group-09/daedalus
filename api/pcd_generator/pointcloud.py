import matplotlib.image as mpimg
import os

# Read in the image and depth map as seperate assets

pcd_generator_dir = os.path.dirname(os.path.abspath(__file__))
image_location = pcd_generator_dir + '/DSC00530.JPG'
# depth_map_location = '2.png'

# Load in the images
# depth_map = mpimg.imread(depth_map_location)
image = mpimg.imread(image_location)


print(image.shape)
rows, cols, colours = image.shape

# Send pixels not correctly mapped to the back
max_val = image.max() * 1.1

# Cut down pixels for time purpose
# Computations need to be under 30s
pixel_cut = 10

total_points = round((rows * cols) / (pixel_cut * pixel_cut))

with open(pcd_generator_dir + "/result.pcd", "w", encoding="UTF-8") as pcd:
    pcd.write("# .PCD v0.7 - Point Cloud Data file format")
    pcd.write("VERSION 0.7\n")
    pcd.write("FIELDS x y z rgb\n")
    pcd.write("SIZE 4 4 4 4\n")
    pcd.write("TYPE F F F F\n")
    pcd.write("COUNT 1 1 1 1\n")
    pcd.write("WIDTH " + str(total_points)+"\n")
    pcd.write("HEIGHT 1\n")
    pcd.write("VIEWPOINT 0 0 0 1 0 0 0\n")
    pcd.write("POINTS " + str(total_points)+"\n")
    pcd.write("DATA ascii\n")
    # Iterate thorugh all the pixels
    for x in range(0, cols, pixel_cut):
        for y in range(0, rows, pixel_cut):
            # Get point color for pixel
            # print(image[y,x,0])
            # print(image[y,x,1])
            # print(image[y,x,2])
            pixel_color = (image[y, x, 0], image[y, x, 1], image[y, x, 2])
            hex_color = image[y, x, 0] * \
                (16 ** 4) + image[y, x, 1] * (16 ** 2) + image[y, x, 2]
            # Get point depth for each particle
            depth = image[y, x, 1]  # depth_map[y,x]
            # Send points not correctly mapped to the back
            if depth == 0:
                depth = max_val
            pcd.write(str(x/1000) + " " + str(depth/1000) + " " +
                      str(y/1000) + " " + str(hex_color) + "\n")


print("Finished Generating")
