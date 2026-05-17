const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'assets');

// get all png files
const files = fs.readdirSync(directoryPath);

files.forEach(file => {
    if (path.extname(file) === '.png') {
        const filePath = path.join(directoryPath, file);
        const svgFilePath = path.join(directoryPath, file.replace('.png', '.svg'));
        
        // Read image file and convert to base64
        const bitmap = fs.readFileSync(filePath);
        const base64Image = Buffer.from(bitmap).toString('base64');
        const dataUri = `data:image/png;base64,${base64Image}`;
        
        // Wrap in SVG
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg">
  <image href="${dataUri}" width="100%" height="100%" />
</svg>`;

        fs.writeFileSync(svgFilePath, svgContent);
        console.log(`Converted ${file} to SVG`);
        
        // Optionally delete the png
        fs.unlinkSync(filePath);
    }
});
