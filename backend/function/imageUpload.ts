import fs from 'fs'

export default function uploadImage(imageData: string) {

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const name = Date.now();
      const filePath = `./upload/${name}.png`
      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
      return `http://localhost:4000/image/${name}.png`;

}