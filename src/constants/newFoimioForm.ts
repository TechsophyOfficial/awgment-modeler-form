import { FormioSchema } from 'components/formModeler/FormTypes';
import { customAlphabet } from 'nanoid';

interface GetNewForm {
    formName: string;
    newFormioForm: FormioSchema;
}

const getNewFormioForm = (): GetNewForm => {
    const alphabets = '0123456789abcdefghijklmnopqrstuvwxyz';
    const getUniqueID = customAlphabet(alphabets, 7);
    const formID = getUniqueID();
    const formName = `Form_${formID}`;

    const newFormioForm: FormioSchema = {
        display: 'form',
        components: [],
    };
    return { formName, newFormioForm };
};

export default getNewFormioForm;
