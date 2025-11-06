import { BeatLoader } from "react-spinners";

export default function Loading() {
  return (
    <section className="bg-[#9DE99D] relative flex min-h-screen flex-col items-center justify-center mx-auto text-gray-900">
        <h1 className="text-5xl mdl:text-6xl font-bold italic z-50 flex items-end">
            <span>Loading</span>
            <BeatLoader
                color={"#000000"}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            </h1>
    </section>
  )
}