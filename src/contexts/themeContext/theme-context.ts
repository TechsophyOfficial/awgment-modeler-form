import { createContext } from 'react';
import { ThemeProps } from '../../services/ThemeService';

export interface ThemeContextProps {
    theme: ThemeProps;
    updateTheme: (data: ThemeProps) => void;
}

const ThemeContext = createContext({} as ThemeContextProps);

export default ThemeContext;
