const OrientDBClient = require("orientjs").OrientDBClient;



// Node.js - Read file and stop if text after line number is empty
const fs = require('fs');

function readFile() {
    try {
        const fileContent = fs.readFileSync('D:\\project\\CSDL_FoodGraphDB - DATASET.tsv', 'utf8');
        const lines = fileContent.split('\n');
        var cmdText = "INSERT INTO Food (name) VALUES";
        for (let i = 0; i < lines.length; i++) {
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
           //INSERT INTO Food (name) VALUES ('Gỏi cá trích'), ('Cháo hải sản')
            cmdText += "('"+columns[1]+"'),";
            
           
        }
        insert(cmdText.substring(0,cmdText.length - 1));
        
    } catch (error) {
        console.error('Error reading file:', error.message);
    }
}

function insert(cmdText)
{
OrientDBClient.connect({
    host: "54.224.202.16",
    port: 2424
  }).then(client => {
    console.log('connection ok', client);
    client.session({ name: "testImport", username: "root", password: "Tam@1234" })
    .then(session => {
        // use the session
        // close the session
        console.log(cmdText);
        session.command(cmdText)
        .all()
        .then(result => {
            console.log(result);
            return session.close();
            return client.close();
        }).error((err)=>{
            return session.close();
       return client.close();
        });
       return session.close();
       return client.close();
    });
    
  }).then(()=> {
     console.log("Client closed");
  });
}

readFile();
return