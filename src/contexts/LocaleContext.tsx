import React from 'react';
import { IntlProvider } from 'react-intl';
import englishTranslations from '../translations/en.json';

export const LocaleContext = React.createContext<{
    language: { id?: string; code?: string; name?: string };
    country: { id?: string; code?: string; name?: string };
    translations: unknown;
}>({
    language: {},
    country: {},
    translations: {},
});

interface languageOrCountryObject {
    id?: string;
    code?: string;
    name?: string;
}

interface LocaleProviderState {
    language: languageOrCountryObject;
    country: languageOrCountryObject;
    translations: unknown;
}

class LocaleProvider extends React.Component<unknown, LocaleProviderState> {
    constructor(props) {
        super(props);
        this.state = {
            language: { id: '', code: '', name: '' },
            country: { id: '', code: '', name: '' },
            translations: englishTranslations,
        };
    }

    render() {
        const { language: { code } = {}, translations } = this.state;
        return (
            <LocaleContext.Provider value={{ ...this.state }}>
                <IntlProvider
                    locale={code || 'en'}
                    defaultLocale="en"
                    messages={translations as Record<string, string>}>
                    {this.props.children}
                </IntlProvider>
            </LocaleContext.Provider>
        );
    }
}

export default LocaleProvider;
