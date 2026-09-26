export const getImageUrl = (image) => {
  if (!image) return '';
  
  // If it's already an absolute URL (like Cloudinary), use it directly
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  // If it's a relative path (like /uploads/filename.jpg), prepend the backend URL
  // We use the production backend URL here.
  return `https://engima-technical-club-website-3.onrender.com${image}`;
};
