// Node.js - Read file and stop if text after line number is empty
const OrientDBClient = require("orientjs").OrientDBClient;
const fs = require('fs');

class DataImportModel{
    foods = [];
    categories = [];
    regions = [];
    tastes = [];
    ingredients = [];
    cookMethods = [];
    ageGroups = [];
}

foodIndex = 1;
ingredientClIndex = 2;
regionClIndex = 6;
tasteClIndex = 3;
cookMethodClIndex = 4;
categoryIndex = 5;
imaClIndex = 7;
priceClIndex = 8;
ageGroupclIndex = 9;

function readFile() {
    dataImport = new DataImportModel()
    try {
        const fileContent = fs.readFileSync('data/DATASET.tsv', 'utf8');
        const lines = fileContent.split('\n');
        rowCount = lines.length;
        startRowIndex = 2;
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
            const taste = columns[tasteClIndex] ? columns[tasteClIndex].trim().toLocaleLowerCase() : '';
            foodTastes = []
            if(taste != ''){
                taste.split(',').forEach((item)=>{
                    text = item.trim();
                    foodTastes.push(text);
                    if(dataImport.tastes.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.tastes.push({name:text});
                    }
                });
            }

            const ingredient = columns[ingredientClIndex] ? columns[ingredientClIndex].trim().toLocaleLowerCase() : '';
            foodIngredients = []
            if(ingredient != ''){
                ingredient.split(',').forEach((item)=>{
                    text = item.trim();
                    foodIngredients.push(text);
                    if(dataImport.ingredients.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.ingredients.push({name:text});
                    }
                });
            }

            const cookMethod = columns[cookMethodClIndex] ? columns[cookMethodClIndex].trim().toLocaleLowerCase() : '';
            foodCookMethods = []
            if(cookMethod != ''){
                cookMethod.split(',').forEach((item)=>{
                    text = item.trim();
                    foodCookMethods.push(text);
                    if(dataImport.cookMethods.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.cookMethods.push({name:text});
                    }
                });
            }

            const category = columns[categoryIndex] ? columns[categoryIndex].trim().toLocaleLowerCase() : '';
            foodCategories = []
            if(category != ''){
                category.split(',').forEach((item)=>{
                    text = item.trim();
                    foodCategories.push(text);
                    if(dataImport.categories.findIndex(x=>x.name == text) < 0 && text != ''){
                        dataImport.categories.push({name:text});
                    }
                });
            }
            const ageGroup = columns[ageGroupclIndex] ? columns[ageGroupclIndex].trim().toLocaleLowerCase() : '';
            foodAgeGroups = []
            if(ageGroup != '')
            {
                ageGroup.split(',').forEach((item)=>{
                    text = item.trim();
                    foodAgeGroups.push(text);
                    if(dataImport.ageGroups.findIndex(x=>x.name == text) < 0 && text != '')
                    {
                        dataImport.ageGroups.push({name:text});
                    }
                });
            }     
            const region = columns[regionClIndex] ? columns[regionClIndex].trim().toLocaleLowerCase() : '';
            foodRegions = []
            if(region != '')
            {
                region.split(',').forEach((item)=>{
                    text = item.trim();
                    foodRegions.push(text);
                    if(dataImport.regions.findIndex(x=>x.name == text) < 0 && text != '')
                    {
                        dataImport.regions.push({name:text});
                    }
                });
            }
            const foodName = columns[foodIndex] ? columns[foodIndex].trim().toLocaleLowerCase() : '';
            const ima = columns[imaClIndex] ? columns[imaClIndex].trim().toLocaleLowerCase() : '';
            const price = columns[priceClIndex] ? columns[priceClIndex].trim().toLocaleLowerCase() : '';
            dataImport.foods.push({name: foodName, image_url:ima, ingredients: foodIngredients
                , tastes: foodTastes, cookMethods: foodCookMethods, ageGroups: foodAgeGroups
                , regions : foodRegions
                , categories: foodCategories, price: Number(price)
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
        User	Người dùng	(name, age, gender, email, password)
        AgeGroup	Nhóm tuổi	label: "trẻ em", "người lớn", "cao tuổi",...
        Taste	Vị	name: "ngọt", "cay", "chua", "mặn",...
        Food	Món ăn cụ thể	name, calories, image_url, description, price
        Category	Phân loại món ăn	name: "món khô", "món nước","món chay", "món kiên"
        Region	Vùng miền ẩm thực	name: "Bắc", "Nam", "Huế", "Hàn Quốc",...
        Ingredient	Thành phần nguyên liệu	name, type, allergen_info, calories
        CookingMethod	Cách chế biến	name: "nướng", "chiên", "xào", "luộc", "hấp",...

        Tên Edge	Từ Node → Đến Node	Ý nghĩa
        BELONGS_TO_AGE	User → AgeGroup	Người dùng thuộc nhóm tuổi nào
        LIKES_TASTE	User → Taste	Người dùng thích vị nào
        PREFERS_CATEGORY	User → Category	Người dùng thích loại món nào
        PREFERS_REGION	User → Region	Người dùng thích ẩm thực vùng nào
        PREFERS_METHOD	User → CookingMethod	Người dùng thích cách chế biến nào

        HAS_TASTE	Food → Taste	Món ăn có vị gì
        SUITABLE_FOR	Food → AgeGroup	Món ăn phù hợp với độ tuổi nào
        BELONGS_TO	Food → Category	Món ăn thuộc loại nào
        FROM_REGION	Food → Region	Món ăn đặc trưng vùng nào
        HAS_INGREDIENT	Food → Ingredient	Món ăn gồm các nguyên liệu nào
        COOKED_BY	Food → CookingMethod	Món ăn được chế biến theo cách nào

        CREATE CLASS Food EXTENDS V
        CREATE CLASS Ingredient EXTENDS V
        CREATE CLASS Region EXTENDS V
        CREATE CLASS Taste EXTENDS V
        CREATE CLASS Category EXTENDS V
        CREATE CLASS AgeGroup EXTENDS V
        CREATE CLASS CookingMethod EXTENDS V

        CREATE CLASS HAS_TASTE EXTENDS E
        CREATE CLASS SUITABLE_FOR EXTENDS E
        CREATE CLASS BELONGS_TO EXTENDS E
        CREATE CLASS FROM_REGION EXTENDS E
        CREATE CLASS HAS_INGREDIENT EXTENDS E
        CREATE CLASS COOKED_BY EXTENDS E

        delete all

        begin;
            TRUNCATE CLASS Food UNSAFE;
            TRUNCATE CLASS Ingredient UNSAFE;
            TRUNCATE CLASS Region UNSAFE;
            TRUNCATE CLASS Taste UNSAFE;
            TRUNCATE CLASS Category UNSAFE;
            TRUNCATE CLASS AgeGroup UNSAFE;
            TRUNCATE CLASS CookingMethod UNSAFE;

            TRUNCATE CLASS HAS_TASTE UNSAFE;
            TRUNCATE CLASS SUITABLE_FOR UNSAFE;
            TRUNCATE CLASS BELONGS_TO UNSAFE;
            TRUNCATE CLASS FROM_REGION UNSAFE;
            TRUNCATE CLASS HAS_INGREDIENT UNSAFE;
            TRUNCATE CLASS COOKED_BY UNSAFE;
        commit;
    */
    // node
    cmd = "";
    // Ingredient
    dataImport.ingredients.forEach(item=>{
        cmd += "INSERT INTO Ingredient(name) values('"+item.name+"');\n";
    });
    // Category
    dataImport.categories.forEach(item=>{
        cmd += "INSERT INTO Category(name) values('"+item.name+"');\n";
    });
    // CookingMethod
    dataImport.cookMethods.forEach(item=>{
        cmd += "INSERT INTO CookingMethod(name) values('"+item.name+"');\n";
    });
    // Region
    dataImport.regions.forEach(item=>{
        cmd += "INSERT INTO Region(name) values('"+item.name+"');\n";
    });
    // Taste
    dataImport.tastes.forEach(item=>{
        cmd += "INSERT INTO Taste(name) values('"+item.name+"');\n";
    });
    // AgeGroup
    cmd += "INSERT INTO AgeGroup(name, fromAge, toAge) values('trẻ em',0,12);\n";
    cmd += "INSERT INTO AgeGroup(name, fromAge, toAge) values('thiếu niên',13,17);\n";
    cmd += "INSERT INTO AgeGroup(name, fromAge, toAge) values('thanh niên',18,30);\n";
    cmd += "INSERT INTO AgeGroup(name, fromAge, toAge) values('trung niên',31,59);\n";
    cmd += "INSERT INTO AgeGroup(name, fromAge, toAge) values('cao niên',60,150);\n";

    dataImport.tastes.forEach(item=>{
        cmd += "INSERT INTO Taste(name) values('"+item.name+"');\n";
    });
    // food
    dataImport.foods.forEach(item=>{
        // node food
        cmd += "INSERT INTO Food(name, calories, image_url, description, price) VALUES ('"+item.name+"', '', '"+item.image_url+"','',"+item.price+");\n";
        // Egde of food
        // HAS_INGREDIENT	Food → INGREDIENT
        
        if(item.ingredients.length > 0)
            cmd += "CREATE EDGE HAS_INGREDIENT FROM (SELECT FROM Food WHERE name = '"+item.name+"') TO (SELECT FROM Ingredient WHERE name in "+( "['"+ item.ingredients.join("','") + "']")+");\n";
        // HAS_TASTE
        if(item.tastes.length > 0)
            cmd += "CREATE EDGE HAS_TASTE FROM (SELECT FROM Food WHERE name = '"+item.name+"') TO (SELECT FROM Taste WHERE name in "+( "['"+ item.tastes.join("','") + "']")+");\n";
        
        // SUITABLE_FOR Food - AgeGroup
        if(item.ageGroups.length > 0)
            cmd += "CREATE EDGE SUITABLE_FOR FROM (SELECT FROM Food WHERE name = '"+item.name+"') TO (SELECT FROM AgeGroup WHERE name in "+( "['"+ item.ageGroups.join("','") + "']")+");\n";
        
        // FROM_REGION
        if(item.regions.length > 0)
            cmd += "CREATE EDGE FROM_REGION FROM (SELECT FROM Food WHERE name = '"+item.name+"') TO (SELECT FROM Region WHERE name in "+( "['"+ item.regions.join("','") + "']")+");\n";
        
        // BELONGS_TO	Food → Category
        if(item.categories.length > 0)
            cmd += "CREATE EDGE BELONGS_TO FROM (SELECT FROM Food WHERE name = '"+item.name+"') TO (SELECT FROM Category WHERE name in "+( "['"+ item.categories.join("','") + "']")+");\n";
        
        // COOKED_BY
        if(item.cookMethods.length > 0)
           cmd += "CREATE EDGE COOKED_BY FROM (SELECT FROM Food WHERE name = '"+item.name+"') TO (SELECT FROM CookingMethod WHERE name in "+( "['"+ item.cookMethods.join("','") + "']")+");\n";

    });
    truncateCmd = ''
            +'TRUNCATE CLASS Food UNSAFE;'
            +'TRUNCATE CLASS Ingredient UNSAFE;'
            +'TRUNCATE CLASS Region UNSAFE;'
            +'TRUNCATE CLASS Taste UNSAFE;'
            +'TRUNCATE CLASS Category UNSAFE;'
            +'TRUNCATE CLASS AgeGroup UNSAFE;'
            +'TRUNCATE CLASS CookingMethod UNSAFE;'

            +'TRUNCATE CLASS HAS_TASTE UNSAFE;'
            +'TRUNCATE CLASS SUITABLE_FOR UNSAFE;'
            +'TRUNCATE CLASS BELONGS_TO UNSAFE;'
            +'TRUNCATE CLASS FROM_REGION UNSAFE;'
            +'TRUNCATE CLASS HAS_INGREDIENT UNSAFE;'
            +'TRUNCATE CLASS COOKED_BY UNSAFE;';
    
    return "begin; "+truncateCmd+cmd+" commit;";
}

function executeBatchScript(batchScript)
{
OrientDBClient.connect({
    host: "54.224.202.16",
    port: 2424
  }).then(client => {
    console.log('connection ok', client);
    client.session({ name: "testImport", username: "root", password: "Tam@1234" })
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
console.log(dataImport.categories);
batchScript = generateScript(dataImport);
console.log(batchScript);
executeBatchScript(batchScript);

return