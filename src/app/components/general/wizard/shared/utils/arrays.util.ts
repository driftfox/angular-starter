import { FormGroup } from '@angular/forms';

type ArrayIndex = Record<string, number>;

export const arrayIndexMapping = (path: string, form: FormGroup, arrayIndexes?: FormGroup) => {
  if (arrayIndexes) {
    const indexes2: ArrayIndex = arrayIndexes.getRawValue();
    console.log(indexes2);
  }

  const arrayIndexes2: ArrayIndex = {
    'level1.level2': 0,
    'level1.level2.0.level3.level4': 2,
    'hello' : 42
  };

  const pathArray = path.split('.');
  // Check if this path has an array index
  // The check is performed by splitting the array and using isNaN to check for a valid number
  const hasArray = pathArray.reduce((a, b) => a || !isNaN(parseInt(b)), false);
  // If an array index was found in the path
  if (hasArray) {
    // Create a new array that will match the format in the arrayIndex record
    // This array will combine all NON indexes into a single path and split everytime it finds a path
    // Load first path into path array
    const arrayNew: string[] = [pathArray[0]];

    // Loop through source path array, start on entry 2
    pathArray.slice(1).forEach(x => {
      if (!isNaN(parseInt(x)) || !isNaN(parseInt(arrayNew[arrayNew.length - 1]))) {
        arrayNew.push(x);
      } else {
        arrayNew[arrayNew.length - 1] = arrayNew[arrayNew.length - 1] + '.' + x;
      }
    });
    console.log(arrayNew);
    // Now loop over the nearly generated path array
    // Search inside the indexes record for path matches
    for (let i = 0; i < arrayNew.length; i++) {
        const element = arrayNew[i];
        // If a path match was found then an index override was found in the indexes array
        if (typeof arrayIndexes2[element] !== 'undefined') {
            arrayNew[i + 1] = String(arrayIndexes2[element]);
            delete arrayIndexes2[element];
            // Figure out if any NESTED paths are in the array
            Object.keys(arrayIndexes2).forEach(key => {
            
                if (key.startsWith(element)) {
                    console.warn(element, ' - ', key)
                }
             });
        } else {
            break;
        }
        
    }
    console.log(arrayNew.join('.'));

  }

  return form.get(path);
};
