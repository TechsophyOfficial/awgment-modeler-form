import { PREFERENCE_ENDPOINT, THEME_ENDPOINT } from '../constants/endpoints';
import { request, ResponseProps } from '../request';

type Id = string;

interface PreferenceData {
    themeId: Id;
}

interface Colors {
    headerColor: string;
    textColor: string;
}

interface Fonts {
    font: string;
    fontSize: string;
}

export interface ThemeProps {
    colors: Colors;
    fonts: Fonts;
}

interface ThemeData {
    id: Id;
    content: ThemeProps;
}

// export const PREFERENCE_API_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${PREFERENCE_ENDPOINT}`;
// export const THEME_API_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${THEME_ENDPOINT}`;

const getPreferenceThemeId = async (apiGatewayUrl): Promise<Id | null> => {
    const PREFERENCE_API_ENDPOINT = `${apiGatewayUrl}${PREFERENCE_ENDPOINT}`;
    const res: ResponseProps = (await request.get(PREFERENCE_API_ENDPOINT)) as ResponseProps;
    if (res.data) {
        const preferenceData: PreferenceData = res.data as PreferenceData;
        return preferenceData.themeId;
    }
    return null;
};

export const getSelectedTheme = async (apiGatewayUrl): Promise<{ success: boolean; data?: ThemeProps }> => {
    const themeId = await getPreferenceThemeId(apiGatewayUrl);
    const THEME_API_ENDPOINT = `${apiGatewayUrl}${THEME_ENDPOINT}`;
    if (themeId) {
        const res: ResponseProps = (await request.get(`${THEME_API_ENDPOINT}/${themeId}`)) as ResponseProps;
        if (res.data) {
            const themeData: ThemeData = res.data as ThemeData;
            return { success: true, data: themeData.content };
        }
        return { success: false };
    }
    return { success: false };
};
