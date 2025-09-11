# Hero Image Setup Instructions

## How to Replace Your Hero Image

1. **Save your new image** to the `src/` folder with the name `myProfPhoto.png`
   - This will replace the existing image file
   - Make sure the image shows a person's head and shoulders (like the cartoon avatar you described)

2. **Perfect Head Alignment** - The CSS is already configured for perfect circular alignment:
   - `object-fit: cover` - Ensures the image fills the circle completely
   - `object-position: center 30%` - Positions the head perfectly in the center of the circle
   - The `30%` vertical position focuses on the head area rather than the center of the entire image

3. **Image Requirements**:
   - **Format**: PNG or JPG
   - **Size**: At least 400x400 pixels (will be automatically resized)
   - **Content**: Head and shoulders visible (like your cartoon avatar description)
   - **Background**: Any color (will be cropped to circle)

## Current Image Path
The hero section uses: `src/myProfPhoto.png`

## CSS Configuration
The following CSS ensures perfect head alignment:

```css
.hero-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 30%;  /* This positions the head perfectly */
  /* ... other styles ... */
}
```

## Fine-tuning
If the head isn't perfectly centered after replacing the image, you can adjust the `object-position` values:
- `center 20%` - Moves focus higher (more head, less shoulders)
- `center 40%` - Moves focus lower (more shoulders, less head)
- `center 30%` - Current setting (balanced head/shoulders)

## Mobile Responsive
The same alignment settings are applied to mobile versions:
- **Tablet (768px)**: 120px circle
- **Mobile (480px)**: 100px circle

Just replace the image file and the perfect circular alignment will work automatically!
