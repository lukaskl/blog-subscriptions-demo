// we need to use OmitSafe instead of Omit, see https://github.com/BohemianCoding/Cloud/issues/2318
type OmitSafe<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// similar to Omit, Extract is also not strict enough:
type ExtractSafe<T, U extends T> = U
