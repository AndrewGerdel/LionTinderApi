import {uploadImageByUrl} from '../logic/image.js';

const res = {
    status: (code) => {
        return {
            json: (output) => {
                console.log(`Result: ${output}`);
            }
        };
    }
};

const uploadImages = (async() => {
    await uploadImageByUrl({ body: {name: 'Lion #1', description: 'Picture #1', imageUrl: 'https://cdn.mos.cms.futurecdn.net/J9KeYkEZf4HHD5LRGf799N.jpg'}}, res);
    await uploadImageByUrl({ body: {name: 'Lion #2', description: 'Picture #2',imageUrl: 'https://images.theconversation.com/files/445057/original/file-20220208-19-3ob7k4.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #3', description: 'Picture #3',imageUrl: 'https://nationalzoo.si.edu/sites/default/files/styles/1400_scale/public/animals/exhibit/africanlion-005.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #4', description: 'Picture #4',imageUrl: 'https://lionalert.org/wp-content/uploads/2020/01/Lion-Family-1024x675.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #5', description: 'Picture #5',imageUrl: 'https://i.pinimg.com/originals/6f/98/c6/6f98c6a5011c354a082ac561cd15ef50.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #6', description: 'Picture #6',imageUrl: 'https://thumbs.dreamstime.com/b/portrait-lion-black-detail-face-lion-hight-quality-portrait-lion-portrait-animal-portrait-lion-black-detail-145612151.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #7', description: 'Picture #7',imageUrl: 'https://cdn.britannica.com/55/2155-050-604F5A4A/lion.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #8', description: 'Picture #8',imageUrl: 'https://i.etsystatic.com/28355544/r/il/3f1c48/3445333086/il_794xN.3445333086_sui4.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #9', description: 'Picture #9',imageUrl: 'https://images.takeshape.io/eec0d9cd-dc81-4ba8-ac20-50da147f43d2/dev/f787083f-6f9a-4a6f-95c4-be5cd204aa1c/pride-snarling-lions.jpg'}}, res)
    await uploadImageByUrl({ body: {name: 'Lion #9', description: 'Picture #10',imageUrl: 'https://www.differio.com/media/catalog/product/cache/0a727dd2e0a45cdfc82e01aae0d95d43/i/m/img_3994b.jpg'}}, res)
    console.log('Done!');
})
 
uploadImages();
