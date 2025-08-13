// Node.js - Read file and stop if text after line number is empty
const fs = require('fs');

foodIndex = 1;
ingredientClIndex = 2;
regionClIndex = 6;
tasteClIndex = 3;
cookMethodClIndex = 4;
categoryIndex = 5;
imaClIndex = 7;
startRowIndex = 2;

function readFile() {
    dataImport = {
            foods : [],
            categories: [],
            regions: [],
            tastes:[],
            ingredients: [],
            cookMethods: [],
        }
    try {
        const fileContent = fs.readFileSync('data/DATASET.tsv', 'utf8');
        const lines = fileContent.split('\n');
        //rowCount = 3;
        for (let i = startRowIndex; i < lines.length; i++) {
            
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
            const regionInput = columns[regionClIndex] ? columns[regionClIndex].trim().toLocaleLowerCase() : '';
            if(dataImport.regions.findIndex(x=>x.name == regionInput) < 0 && regionInput != ''){
                dataImport.regions.push({name: regionInput});
            }
            const foodName = columns[foodIndex] ? columns[foodIndex].trim().toLocaleLowerCase() : '';
            const ima = columns[imaClIndex] ? columns[imaClIndex].trim().toLocaleLowerCase() : '';
            dataImport.foods.push({name: foodName, image_url:ima, ingredients: foodIngredients
                , tastes: foodTastes, cookMethods: foodCookMethods
                , categories: foodCategories
            });

        }
        
    } catch (error) {
        console.error('Error reading file:', error.message);
    }
    return dataImport;
}

dataImport = readFile();
console.log(dataImport);
return