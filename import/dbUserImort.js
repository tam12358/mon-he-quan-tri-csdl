// Node.js - Read file and stop if text after line number is empty
const OrientDBClient = require("orientjs").OrientDBClient;
const fs = require('fs');

class DataImportModel{
    users = [];
    foods = [];
    categories = [];
    regions = [];
    tastes = [];
    ingredients = [];
    cookMethods = [];
    allergies = [];
}
nameClIndex = 1;
yearClIndex = 2;
genderClIndex = 3;
regionClIndex = 4;
passwordClIndex = 5;
emailClIndex = 6;
phoneClIndex = 7;
likesFoodClIndex = 8;
likesCategoryIndex = 9;
likesTasteIndex = 10;
likesCookMethodIndex = 11;
allergyClIndex = 12;

function readFile() {
    dataImport = new DataImportModel()
    try {
        const fileContent = fs.readFileSync('data/USER.tsv', 'utf8');
        const lines = fileContent.split('\n');
        rowCount = lines.length;
        startRowIndex = 1;
        for (let i = startRowIndex; i < rowCount; i++) {
            
            const currentLine = lines[i].trim();
            if (!currentLine) continue;
            
            const columns = currentLine.split('\t');
            const firstColumn = columns[0] ? columns[0].trim() : '';
            
            // If first column is a number, check the text after it
            if (!isNaN(firstColumn) && firstColumn !== '') {
                const textAfterNumber = columns[1] ? columns[1].trim() : '';
                // If text after the line number is empty, stop reading
                if (!textAfterNumber) {
                    break;
                }
            }
            const likesFoods = columns[likesFoodClIndex] ? columns[likesFoodClIndex].trim().toLocaleLowerCase() : '';
            userLikesFoods = []
            if(likesFoods != ''){
                likesFoods.split(',').forEach((item)=>{
                    text = item.trim();
                    userLikesFoods.push(text);
                    if(dataImport.foods.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.foods.push({name:text});
                    }
                });
            }

            const likesCatogry = columns[likesCategoryIndex] ? columns[likesCategoryIndex].trim().toLocaleLowerCase() : '';
            userLikesCategory = []
            if(likesCatogry != ''){
                likesCatogry.split(',').forEach((item)=>{
                    text = item.trim();
                    userLikesCategory.push(text);
                    if(dataImport.categories.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.categories.push({name:text});
                    }
                });
            }

            const likesTaste = columns[likesTasteIndex] ? columns[likesTasteIndex].trim().toLocaleLowerCase() : '';
            userLikesTaste = []
            if(likesTaste != ''){
                likesTaste.split(',').forEach((item)=>{
                    text = item.trim();
                    userLikesTaste.push(text);
                    if(dataImport.tastes.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.tastes.push({name:text});
                    }
                });
            }

            const likesCookMethods = columns[likesCookMethodIndex] ? columns[likesCookMethodIndex].trim().toLocaleLowerCase() : '';
            userLikesCookMethods = []
            if(likesCookMethods != ''){
                likesCookMethods.split(',').forEach((item)=>{
                    text = item.trim();
                    userLikesCookMethods.push(text);
                    if(dataImport.cookMethods.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.cookMethods.push({name:text});
                    }
                });
            }

            const allergy = columns[allergyClIndex] ? columns[allergyClIndex].trim().toLocaleLowerCase() : '';
            userAllergy = []
            if(allergy != ''){
                allergy.split(',').forEach((item)=>{
                    text = item.trim();
                    userAllergy.push(text);
                    if(dataImport.allergies.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.allergies.push({name:text});
                    }
                });
            }
            const region = columns[regionClIndex] ? columns[regionClIndex].trim().toLocaleLowerCase() : '';
            userRegions = []
            if(region != ''){
                region.split(',').forEach((item)=>{
                    text = item.trim();
                    userRegions.push(text);
                    if(dataImport.regions.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.regions.push({name:text});
                    }
                });
            }

            const name = columns[nameClIndex] ? columns[nameClIndex].trim().toLocaleLowerCase() : '';
            const yearOfBirth = columns[yearClIndex] ? columns[yearClIndex].trim().toLocaleLowerCase() : '';
            const gender = columns[genderClIndex] ? columns[genderClIndex].trim().toLocaleLowerCase() : '';
            const email = columns[emailClIndex] ? columns[emailClIndex].trim().toLocaleLowerCase() : '';
            const password = columns[passwordClIndex] ? columns[passwordClIndex].trim().toLocaleLowerCase() : '';
            const phone = columns[phoneClIndex] ? columns[phoneClIndex].trim().toLocaleLowerCase() : '';

            dataImport.users.push({name: name, yearOfBirth: Number(yearOfBirth), gender: gender
                , email: email, password: password, phone: phone, userRegions: userRegions
                , userLikesFoods: userLikesFoods, userLikesCategory: userLikesCategory
                , userLikesTaste: userLikesTaste, userLikesCookMethods: userLikesCookMethods, userAllergy: userAllergy
            });

        }
        
    } catch (error) {
        console.error('Error reading file:', error.message);
    }
    return dataImport;
}
function generateScript(dataImport)
{
    /*
        Tên Node	Mô tả	Thuộc tính (ví dụ)
        User	Người dùng	(name, yearOfBirth, gender, email, phone, password)

        Tên Edge	Từ Node → Đến Node	Ý nghĩa
        LIKES_FOOD	User → Food	Người dùng thích món nào
        LIKES_TASTE	User → Taste	Người dùng thích vị nào
        PREFERS_CATEGORY	User → Category	Người dùng thích loại món nào
        PREFERS_REGION	User → Region	Người dùng thích ẩm thực vùng nào
        ALLERGY_INGREDIENT	User → Ingredient	Dị ứng với thành phần
        PREFERS_METHOD	User → CookingMethod	Người dùng thích cách chế biến nào

        Create node

        CREATE CLASS User EXTENDS V;
        
        create Egde

        CREATE CLASS LIKES_FOOD EXTENDS E;
        CREATE CLASS LIKES_TASTE EXTENDS E;
        CREATE CLASS PREFERS_CATEGORY EXTENDS E;
        CREATE CLASS PREFERS_REGION EXTENDS E;
        CREATE CLASS ALLERGY_INGREDIENT EXTENDS E;
        CREATE CLASS PREFERS_METHOD EXTENDS E;

        delete all

        begin;
            TRUNCATE CLASS User UNSAFE;

            TRUNCATE CLASS LIKES_FOOD UNSAFE;
            TRUNCATE CLASS LIKES_TASTE UNSAFE;
            TRUNCATE CLASS PREFERS_CATEGORY UNSAFE;
            TRUNCATE CLASS PREFERS_REGION UNSAFE;
            TRUNCATE CLASS ALLERGY_INGREDIENT UNSAFE;
            TRUNCATE CLASS PREFERS_METHOD UNSAFE;
        commit;
    */
    // node
    cmd = "";
    // user
    dataImport.users.forEach(item=>{
        // node user
        cmd += "INSERT INTO User(name, yearOfBirth, gender, email, phone, password) VALUES ('"+item.name+"', "+item.yearOfBirth+",'"+item.gender+"','"+item.email+"','"+item.phone+"','"+item.password+"');\n";
        // Egde of user
        // LIKES_FOOD
        if(item.userLikesFoods.length > 0)
            cmd += "CREATE EDGE LIKES_FOOD FROM (SELECT FROM User WHERE name = '"+item.name+"') TO (SELECT FROM Food WHERE name in "+( "['"+ item.userLikesFoods.join("','") + "']")+");\n";
        // LIKES_TASTE
        if(item.userLikesTaste.length > 0)
            cmd += "CREATE EDGE LIKES_TASTE FROM (SELECT FROM User WHERE name = '"+item.name+"') TO (SELECT FROM Taste WHERE name in "+( "['"+ item.userLikesTaste.join("','") + "']")+");\n";
        
        // PREFERS_CATEGORY
        if(item.userLikesCategory.length > 0)
            cmd += "CREATE EDGE PREFERS_CATEGORY FROM (SELECT FROM User WHERE name = '"+item.name+"') TO (SELECT FROM Category WHERE name in "+( "['"+ item.userLikesCategory.join("','") + "']")+");\n";
        
        // PREFERS_REGION
        if(item.userRegions.length > 0)
            cmd += "CREATE EDGE PREFERS_REGION FROM (SELECT FROM User WHERE name = '"+item.name+"') TO (SELECT FROM Region WHERE name in "+( "['"+ item.userRegions.join("','") + "']")+");\n";
        
        // ALLERGY_INGREDIENT
        if(item.userAllergy.length > 0)
            cmd += "CREATE EDGE ALLERGY_INGREDIENT FROM (SELECT FROM User WHERE name = '"+item.name+"') TO (SELECT FROM Ingredient WHERE name in "+( "['"+ item.userAllergy.join("','") + "']")+");\n";
        
        // PREFERS_METHOD
        if(item.userLikesCookMethods.length > 0)
           cmd += "CREATE EDGE PREFERS_METHOD FROM (SELECT FROM User WHERE name = '"+item.name+"') TO (SELECT FROM CookingMethod WHERE name in "+( "['"+ item.userLikesCookMethods.join("','") + "']")+");\n";

    });
    truncateCmd = ''
            +'TRUNCATE CLASS User UNSAFE;'
            +'TRUNCATE CLASS LIKES_FOOD UNSAFE;'
            +'TRUNCATE CLASS LIKES_TASTE UNSAFE;'
            +'TRUNCATE CLASS PREFERS_CATEGORY UNSAFE;'
            +'TRUNCATE CLASS PREFERS_REGION UNSAFE;'
            +'TRUNCATE CLASS ALLERGY_INGREDIENT UNSAFE;'
            +'TRUNCATE CLASS PREFERS_METHOD UNSAFE;'
    
    return "begin; "+truncateCmd+cmd+" commit;";
}

function executeBatchScript(batchScript)
{
OrientDBClient.connect({
    host: "54.224.202.16",
    port: 2424
  }).then(client => {
    console.log('connection ok', client);
    client.session({ name: "testImport", username: "root", password: "" })
    .then(session => {
            session.batch(batchScript)
            .all()
            .then(result => {
                console.log(result);
                session.close();
                client.close();
                console.log("Successful");
            }).error((err)=>{
                session.close();
                client.close();
                console.log("Error");
            });
    });
    
  }).then(()=> {
     console.log("Client closed");
  });
}
dataImport = readFile();
console.log(dataImport);
batchScript = generateScript(dataImport);
console.log(batchScript);
executeBatchScript(batchScript);

return