const supportedCurrencies = require('../internal/coinExtras.json')
const glossaryBase = require('../dist/glossary.json')

const walk = require('walk')
const fs = require('fs')
const walker = walk.walk('./dictionaries')

let glossary = Object.assign({}, glossaryBase)

walker.on('file', (root, fileStats, next) => {
  const dictionary = require(`../dictionaries/${fileStats.name}`)
  const tempGlossary = Object.assign({}, glossary)
  
  Object.keys(dictionary).map((coin, i) => {
    if (glossary[coin]) {
      console.log(coin, 'being added to glossary')
      tempGlossary[coin] = Object.assign(
        {}, 
        tempGlossary[coin], 
        {
          service: Object.assign(
            {},
            glossary[coin].service,
            {
              [fileStats.name.replace('.json', '')]: dictionary[coin]
            }
          )
        }
      ) 
    }


    if (i === Object.keys(dictionary).length - 1) {
      glossary = Object.assign({}, glossary, tempGlossary)
      next()
    }
  })
})

walker.on("end", function () {
  fs.writeFile('dist/glossary.json', JSON.stringify(glossary, null, 2))
})
