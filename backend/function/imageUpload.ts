import fs from 'fs'

export default function uploadImage(imageData: string) {

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const name = Date.now();
      const filePath = `./upload/${name}.png`
      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
      return `https://social-app-api-production.up.railway.app/image/${name}.png`;

}