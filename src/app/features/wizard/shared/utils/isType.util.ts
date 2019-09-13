/** Check for wizard types */
export const isType = {
    formField: (content: any): content is Wizard.FormField => content && content.type === 'formField',
    html: (content: any): content is Wizard.Html => content && content.type === 'html',
    feature: (content: any): content is Wizard.Feature => content && content.type === 'feature',
    row: (content: any): content is Wizard.Row => content && content.type === 'row',
};
