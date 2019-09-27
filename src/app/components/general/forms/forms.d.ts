

declare namespace NtsForms {
    export type FormFieldType =
    | 'text'
    | 'number' // Uses type="number" and ensures the value in the form is a number
    // | 'numberAsString' // Uses type="number" but keeps the numeric value as a string (default behavior)
    | 'currency'
    | 'phoneNumber'
    | 'email'
    | 'ssn'
    | 'password'
    | 'colorpicker'
    // Non text input types
    | 'select' // Native browser select
    | 'dropdown' // NgPrime dropdown
    | 'textarea'
    | 'checkbox'
    | 'checkboxBoolean'
    | 'radio'
    | 'toggle'
    | 'autoComplete'
    | 'date';
}

