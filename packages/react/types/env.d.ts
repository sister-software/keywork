// Force module.
export {}

declare global {
  namespace NodeJSExtensions {
    export interface ProcessEnv {
      NODE_ENV?: string
      BUILD_ID?: string
    }

    export interface Process {
      env: ProcessEnv
    }
  }

  export const process: NodeJSExtensions.Process
}
