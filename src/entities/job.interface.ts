export type ValidateResultType = {
    errorMessage?: string,
    value?: any
}
export default interface IJobBase {
    id: string,
    accountId: number,
    validateData(): ValidateResultType
}