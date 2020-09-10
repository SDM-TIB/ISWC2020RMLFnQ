const parser = require('rocketrml');
var fs = require('fs')

const doMapping = async () => {
  try{
    aux0 = fs.readFileSync('./output/OUTPUT1.csv', 'utf8')  
    aux1 = fs.readFileSync('./output/PROJECT1.csv', 'utf8')
    aux2 = fs.readFileSync('./output/PROJECT2.csv', 'utf8')
    aux3 = fs.readFileSync('./output/PROJECT3.csv', 'utf8')
    aux4 = fs.readFileSync('./output/PROJECT4.csv', 'utf8')
    mapping = fs.readFileSync('./output/transfered_mapping.ttl', 'utf8')
  }catch(e){
    console.log('Error:', e.stack);
  }
  let inputFiles = {
    "./output/OUTPUT1.csv": aux0,
    "./output/PROJECT1.csv": aux1,
    "./output/PROJECT2.csv": aux2,
    "./output/PROJECT3.csv": aux3,
    "./output/PROJECT4.csv": aux4,
  };
  const options = {
    toRDF: true,
    verbose: true,
    xmlPerformanceMode: false,
    functions: {
      'http://users.ugent.be/~bjdmeest/function/grel.ttl#string_replace': function (data) {
        var re = new RegExp(data[1],"g");;
        let result=data[0].toString().replace(re,data[2]);
        return result;
      },
      'http://users.ugent.be/~bjdmeest/function/grel.ttl#toUpperCase': function (data) {
        let result=data[0].toString().toUpperCase();
        return result;
      },
      'http://users.ugent.be/~bjdmeest/function/grel.ttl#toLowerCase': function (data) {
        let result=data[0].toString().toLowerCase();
        return result;
      }
      ,
      'http://www.example.com/variantIdentifier': function (data) {
        let result=""
        if (data[0].toString()!='' && !data[0].toString().includes("?")){
          var re = new RegExp("_.*","g");
          var re2 = new RegExp(">","g");
          var re3 = new RegExp("c\\.","g");
          result = data[1].toString().replace(re,"")+"_"+data[0].replace(re3,"").replace(re2,"~");
          result = data[2]+result
        }
        return result;
      }
    }
  };
  const result = await parser.parseFileLive(mapping, inputFiles, options).catch((err) => { console.log(err); });
  fs.appendFile('output.nt', result, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
};

doMapping();