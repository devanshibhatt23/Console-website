import fs from 'fs';

const updates = [
  { title: "Header Files & Operators", index: 6 },
  { title: "Reference Variables & Typecasting", index: 7 },
  { title: "Constants & Operator Precedence", index: 8 },
  { title: "If-else & Switch Case", index: 9 },
  { title: "Loops (for, while, do-while)", index: 10 },
  { title: "Break & Continue", index: 11 },
  { title: "Pointers In C++", index: 12 },
  { title: "Arrays & Pointer Arithmetic", index: 13 },
  { title: "Struct, Union & Enum", index: 14 },
  { title: "Function Prototype & Functions", index: 15 },
  { title: "Call By Value & Call By Reference", index: 16 },
  { title: "Inline Functions & Default Parameters", index: 17 },
  { title: "Recursion & Recursive Functions", index: 18 },
  { title: "Function Overloading", index: 19 },
  { title: "OOP in C++", index: 20 },
  { title: "Classes & Access Modifiers", index: 21 },
  { title: "Nesting Of Member Functions", index: 22 },
  { title: "Objects In C++", index: 23 },
  { title: "Static Data Members & Methods", index: 24 },
  { title: "Array Of Objects & Object As Parameter", index: 25 },
  { title: "Constructors In C++", index: 29 },
  { title: "Parameterized & Default Constructor", index: 30 },
  { title: "Constructor Overloading", index: 31 },
  { title: "Dynamic Initialisation Of Objects", index: 33 },
  { title: "Copy Constructor", index: 34 },
  { title: "Destructor", index: 35 },
  { title: "Inheritance Part 1", index: 36 },
  { title: "Inheritance Part 2", index: 37 },
  { title: "Single Inheritance", index: 38 },
  { title: "Use Of Protected Access Modifier", index: 39 },
  { title: "Multi-Level Inheritance Part 1", index: 40 },
  { title: "Multi-Level Inheritance Part 2", index: 41 },
  { title: "Virtual Base Class Part 1", index: 44 },
  { title: "Virtual Base Class Part 2", index: 45 },
  { title: "Constructor In Derived Class Part 1", index: 46 },
  { title: "Constructor In Derived Class Part 2", index: 47 },
  { title: "Initialisation List in Constructors", index: 48 },
  { title: "\"new\" & \"delete\" Keywords", index: 50 },
  { title: "Pointers to Objects", index: 51 },
  { title: "Polymorphism", index: 54 },
];

let content = fs.readFileSync('./src/data/resourcesData.js', 'utf-8');

updates.forEach(u => {
  const badUrl = 'https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL';
  const goodUrl = 'https://www.youtube.com/watch?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&index=' + u.index;
  const regex = new RegExp('({.*title: "' + u.title + '".*url: ")' + badUrl.replace(/\\?/g, '\\\\?').replace(/\\./g, '\\\\.') + '(".*})', 'g');
  content = content.replace(regex, '$1' + goodUrl + '$2');
});

content = content.replace(
  /url: "https:\/\/www\.youtube\.com\/playlist\?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ"/g,
  'url: "https://www.youtube.com/watch?v=zJOMt5f1KjI&list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&index=9"'
);

content = content.replace(
  /url: "https:\/\/www\.youtube\.com\/playlist\?list=PLauivoElc3gh3RCiQA82MDI-gR7odfw46"/g,
  'url: "https://www.youtube.com/watch?v=Wdjr6uoZ0e0&list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA&index=22"'
);

content = content.replace(
  /url: "https:\/\/www\.youtube\.com\/playlist\?list=PLu0W_9lII9agpFUAlPFe_VNSelXW5uE0YL"/g,
  'url: "https://www.youtube.com/watch?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&index=18"'
);

content = content.replace(
  /url: "https:\/\/www\.geeksforgeeks\.org\/c-plus-plus-gq\/"/g,
  'url: "https://www.geeksforgeeks.org/cpp-programming-examples/"'
);

fs.writeFileSync('./src/data/resourcesData.js', content);
console.log('Fixed resourcesData.js');
