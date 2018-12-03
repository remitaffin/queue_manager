export interface BaseService {
    send_message(env: any, body: any): any;
    get_message(env: any): any;
}
