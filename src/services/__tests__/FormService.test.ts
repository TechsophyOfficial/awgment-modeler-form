import React from 'react';
import { getFormOrComponentDetails } from '../FormService';
import { request } from '../../request';
import { FORM_ENDPOINT } from 'constants/endpoints';
import AppConfig from '../../appConfig.js';

jest.mock('../../request');

const mockedRequest = request as jest.Mocked<typeof request>;

// const appData: any = React.useContext(AppConfig);
// const apiGatewayUrl = appData.apiGatewayUrl;
const apiGatewayUrl = 'www.google.com';
const FORM_API_ENDPOINT = `${apiGatewayUrl}${FORM_ENDPOINT}`;

describe('getFormOrComponentDetails', () => {
    afterEach(jest.clearAllMocks);
    test('fetches successfully data from an API', async () => {
        const response = {
            success: true,
            message: 'Hello World',
            data: { data: ['mock'] },
        };
        mockedRequest.get.mockResolvedValue(response);
        const result = await getFormOrComponentDetails({ id: '123', apiGatewayUrl: apiGatewayUrl });
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(response);
    });

    test('getFormOrComponentDetails() should call wilth proper Request URL', async () => {
        await getFormOrComponentDetails({ id: '123', apiGatewayUrl: apiGatewayUrl });
        expect(mockedRequest.get).toHaveBeenCalledWith(`${FORM_API_ENDPOINT}/123`);
    });

    test('fetches erroneously data from an API', async () => {
        const response = {
            success: false,
            data: { message: 'Hello World', data: ['mock'] },
        };
        mockedRequest.get.mockResolvedValue(response);
        const result = await getFormOrComponentDetails({ id: '123', apiGatewayUrl: apiGatewayUrl });
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ success: false });
    });
});
