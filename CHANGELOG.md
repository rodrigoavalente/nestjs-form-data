### v1.8.3
- [fix issue 35](https://github.com/dmitriy-nz/nestjs-form-data/issues/35), added missing field `buffer: Buffer` in class `MemoryStoredFile` in version 1.8.0
- Fix link to changelog in README.md

### v1.8.2
- [fix issue 29](https://github.com/dmitriy-nz/nestjs-form-data/issues/29)
- Cleared the default error handling, which duplicated the standard error handling. Custom error handlers work again
- Fixed errors when deleting files after processing requests if there is no delete method

### v1.8.1
- [fix issue 34](https://github.com/dmitriy-nz/nestjs-form-data/issues/34)
- remove 'node:stream' imports to ensure compatibility

### v1.8.0
- Changed incoming arguments for the factory method `StoredFile.create()`
  Your custom classes for saving files will be broken, they will need to be fixed, example in `src/classes/storage/MemoryStoredFile.ts`
- Added [file-type](https://www.npmjs.com/package/file-type) dependency as a reliable source for getting file mime-type and extension.
- Changed `HasMimeType` validator, added second argument to strictly check mime-type source
- Added `HasExtension` validator, to check file extension, uses file-type
- Added tests to test validators
- Modified README.md, added more information about validators and their usage
- Added CHANGELOG.md
