# Creating A New Store

1. Rename the `temp.service.ts` file.  
   _Example:_ `temp.service.ts` becomes `new-prop.service.ts`
2. Within this new service file:
   1. Do a __case sensitive__ find and replace to update Class names.   
      _Example:_ Replace `Temp` with `NewProp`
   2. Do a __case sensitive__ find and replace to update the interface.   
      _Example:_ Replace `Models.User` with `Models.NewModel`
   3. Update the property name of the default selector.   
      _Example:_ `public users$ = this.select();` becomes `public todos$ = this.select();`
   4. _Optional_: Update uniqueID in the section labeled "Configuration" (_if necessary_)
3. Add a reference to this new service in `../domain.service.ts` in the constructor.  
      _Example:_ `public newProp: NewPropService`
