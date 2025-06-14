// Test script to verify setup
const fs = require("fs")
const path = require("path")

console.log("🔍 Testing DrowsyGuard setup...\n")

// Check directories
const requiredDirs = ["temp", "public/models", "scripts"]
requiredDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`✅ Directory exists: ${dir}`)
  } else {
    console.log(`❌ Directory missing: ${dir}`)
    fs.mkdirSync(dir, { recursive: true })
    console.log(`📁 Created directory: ${dir}`)
  }
})

// Check cascade files
const cascadeFiles = [
  "haarcascade_frontalface_alt.xml",
  "haarcascade_lefteye_2splits.xml",
  "haarcascade_righteye_2splits.xml",
]

cascadeFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ Cascade file exists: ${file}`)
  } else {
    console.log(`⚠️  Cascade file missing: ${file}`)
  }
})

// Check model file
const modelFile = "public/models/attentive.h5"
if (fs.existsSync(modelFile)) {
  console.log(`✅ Model file exists: ${modelFile}`)
} else {
  console.log(`⚠️  Model file missing: ${modelFile} (app will run in simulation mode)`)
}

// Check package.json
if (fs.existsSync("package.json")) {
  console.log("✅ package.json exists")
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
  console.log(`📦 Project: ${pkg.name}`)
} else {
  console.log("❌ package.json missing")
}

console.log("\n🎯 Setup verification completed!")
console.log("\n📋 To run the application:")
console.log("1. npm run dev")
console.log("2. Open http://localhost:3000")
