/** Check for wizard types */
export const isType = {
    formField: (content: Wizard.Content): content is Wizard.FormField => content && content.type === 'formField',
    html: (content: Wizard.Content): content is Wizard.FormField => content && content.type === 'html',
    feature: (content: Wizard.Content): content is Wizard.FormField => content && content.type === 'feature',
    row: (content: Wizard.Content): content is Wizard.FormField => content && content.type === 'row',
};
