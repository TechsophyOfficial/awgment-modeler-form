import wretch, { Wretcher } from 'wretch';
import { ResponseChain } from 'wretch/dist/resolver';

export interface ResponseProps {
    success?: boolean;
    data?: unknown;
    ok?: boolean;
    message?: string;
}

type ApiResponse = unknown;

const toJson = (r: ResponseChain): Promise<ApiResponse> => r.json();

const process = async (
    url: string,
    method: (w: Wretcher) => ResponseChain,
    format: (r: ResponseChain) => Promise<ApiResponse>,
    controller?: AbortController,
): Promise<ApiResponse> => {
    const w: Wretcher = controller ? wretch(url).signal(controller) : wretch(url);
    return format(method(w))
        .then((r) => r)
        .catch((error) => {
            console.log(error);
            return {
                success: false,
                message: 'Error communicating with server',
            };
        });
};

export const request = {
    get: (url: string, controller?: AbortController): Promise<ApiResponse> =>
        process(url, (w) => w.auth(`Bearer ${sessionStorage.getItem('react-token')}`).get(), toJson, controller),

    post: (url: string, body: unknown, controller?: AbortController): Promise<ApiResponse> =>
        process(url, (w) => w.auth(`Bearer ${sessionStorage.getItem('react-token')}`).post(body), toJson, controller),

    delete: (url: string, controller?: AbortController): Promise<ApiResponse> =>
        process(url, (w) => w.auth(`Bearer ${sessionStorage.getItem('react-token')}`).delete(), toJson, controller),

    postForm: (url: string, params: { [key: string]: unknown }, controller?: AbortController): Promise<ApiResponse> =>
        process(
            url,
            (w) =>
                w
                    .auth(`Bearer ${sessionStorage.getItem('react-token')}`)
                    .formData(params)
                    .post(),
            toJson,
            controller,
        ),
};
