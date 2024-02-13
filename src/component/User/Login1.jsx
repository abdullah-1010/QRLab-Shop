import * as React from "react";

function MyComponent(props) {
  return (
    <div className="bg-neutral-50 rounded-[50px]">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
        <div className="flex flex-col w-[59%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow justify-center pr-16 w-full rounded-[50px_0px_0px_50px] max-md:mt-10 max-md:max-w-full">
            <img
              loading="lazy"
              srcSet="..."
              className="w-full aspect-[0.74] max-md:mr-2 max-md:max-w-full"
            />
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[41%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col self-stretch px-16 py-11 my-auto w-full font-bold bg-white rounded-3xl border border-solid shadow-2xl border-neutral-200 max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <div className="text-3xl text-center text-sky-950">
              Admin Sign In
            </div>
            <div className="mt-6 text-base uppercase text-slate-600">
              Email{" "}
            </div>
            <div className="justify-center items-start py-6 pr-16 pl-7 mt-1.5 text-lg font-medium lowercase whitespace-nowrap bg-white rounded-md border border-solid shadow-sm border-zinc-300 text-slate-400 max-md:px-5">
              <span className="uppercase">e</span>nter your email
            </div>
            <div className="mt-3.5 text-base uppercase text-slate-600">
              Password{" "}
            </div>
            <div className="justify-center items-start py-5 pr-16 pl-7 mt-1.5 text-lg font-medium lowercase bg-white rounded-md border border-solid shadow-sm border-zinc-300 text-slate-400 max-md:px-5">
              <span className="uppercase">e</span>nter your password
            </div>
            <div className="mt-3.5 text-sm capitalize text-slate-600">
              Forget password?{" "}
            </div>
            <div className="flex gap-5 justify-between mt-6 tracking-wide text-center whitespace-nowrap">
              <div className="grow my-auto text-base leading-4 text-indigo-500 underline">
                <span className="text-slate-600">Don’t have an account?</span>{" "}
                <span className="text-indigo-500 underline">Register</span>
              </div>
              <div className="flex flex-col flex-1 justify-center text-xl leading-4 text-white">
                <div className="flex gap-3.5 justify-between px-7 py-3.5 bg-indigo-500 rounded-[30px] max-md:px-5">
                  <div>Login</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4df99f6de50777597ab3bc6f1fb4013a3f5b61c903e49d8ea6b771b3da6845df?"
                    className="my-auto w-1.5 aspect-[0.55] stroke-[1.667px] stroke-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


