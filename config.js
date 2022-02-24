let configPrompt = "Drag the images below to match the names."; 

// Each object `{}` in this array is a row
// It is  
let configRows = [
  {
    typeColumn1: "text",
    contentColumn1: "Dog",
    typeColumn2: "dragDrop",
    contentColumn2: {type: "image", content: "https://static-assets.codecademy.com/Courses/learn-raspberry-pi/dog.jpg"},
  },
  {
    typeColumn1: "text",
    contentColumn1: "Cat",
    typeColumn2: "dragDrop",
    contentColumn2: {type: "image", content: "https://static-assets.codecademy.com/Courses/learn-raspberry-pi/cat.jpg"},
  },
  {
    typeColumn1: "text",
    contentColumn1: "Tapir",
    typeColumn2: "dragDrop",
    contentColumn2: {type: "image", content: "https://static-assets.codecademy.com/Courses/learn-raspberry-pi/tapir.jpg"},
  },
  {
    typeColumn1: "text",
    contentColumn1: "Rhea",
    typeColumn2: "dragDrop",
    contentColumn2: {type: "image", content: "https://static-assets.codecademy.com/Courses/learn-raspberry-pi/rhea.jpg"},
  },
]