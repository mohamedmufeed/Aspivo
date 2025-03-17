
import { useRef } from "react";
import HiringImage from "../../assets/9802185.jpg"


const Category = () => {
    const categories = [
        { icon: <svg className="mt-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path d="M21 6H9a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V21M24 34v8" /><path d="m32 6l-4 4l4 4m6-8l4 4l-4 4M14 42h20" /></g></svg>, name: "Software Development" },
        { icon: <svg className="mt-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v1.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H21M3 15V5m0 10l3.853-3.21l.004-.003c.697-.581 1.046-.872 1.425-.99a2 2 0 0 1 1.362.061c.367.153.688.474 1.332 1.118l.006.006c.654.654.981.982 1.354 1.133a2 2 0 0 0 1.385.046c.383-.128.733-.434 1.433-1.046L21 7" /></svg>, name: "Marketing & Sales" },
        { icon: <svg className="mt-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512"><path fill="currentColor" d="m29.663 482.25l.087.087a24.85 24.85 0 0 0 17.612 7.342a25.2 25.2 0 0 0 8.1-1.345l142.006-48.172l272.5-272.5A88.832 88.832 0 0 0 344.334 42.039l-272.5 272.5l-48.168 142.002a24.84 24.84 0 0 0 5.997 25.709m337.3-417.584a56.832 56.832 0 0 1 80.371 80.373L411.5 180.873L331.127 100.5ZM99.744 331.884L308.5 123.127l80.373 80.373l-208.757 208.756l-121.634 41.262Z" /></svg>, name: "Design & Creative" },
        { icon: <svg className="mt-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M5.116 20q-.691 0-1.153-.462T3.5 18.384V3h1v15.385q0 .23.192.423t.423.192H20.5v1zm2.269-3.5V9.192h2V16.5zm4.5 0V4.192h2V16.5zm4.5 0v-3.308h2V16.5z" /></svg>, name: "Finance & Accounting" },
        { icon: <svg className="mt-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="m18 20l3.824-3.824a.6.6 0 0 0 .176-.424V10.5A1.5 1.5 0 0 0 20.5 9v0a1.5 1.5 0 0 0-1.5 1.5V15" /><path d="m18 16l.858-.858a.48.48 0 0 0 .142-.343v0a.49.49 0 0 0-.268-.433l-.443-.221a2 2 0 0 0-2.308.374l-.895.895a2 2 0 0 0-.586 1.414V20M6 20l-3.824-3.824A.6.6 0 0 1 2 15.752V10.5A1.5 1.5 0 0 1 3.5 9v0A1.5 1.5 0 0 1 5 10.5V15" /><path d="m6 16l-.858-.858A.5.5 0 0 1 5 14.799v0c0-.183.104-.35.268-.433l.443-.221a2 2 0 0 1 2.308.374l.895.895a2 2 0 0 1 .586 1.414V20m4.167-8h-3.334V9.667H8V6.333h2.333V4h3.334v2.333H16v3.334h-2.333z" /></g></svg>, name: "Healthcare & Medical" },
        { icon: <svg className="mt-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M1.05 21v-2.8q0-.825.425-1.55t1.175-1.1q1.275-.65 2.875-1.1T9.05 14t3.525.45t2.875 1.1q.75.375 1.175 1.1t.425 1.55V21zm8-8q-1.65 0-2.825-1.175T5.05 9H4.8q-.225 0-.362-.137T4.3 8.5t.138-.363T4.8 8h.25q0-1.125.55-2.025T7.05 4.55v.95q0 .225.138.363T7.55 6t.363-.137t.137-.363V4.15q.225-.075.475-.112T9.05 4t.525.038t.475.112V5.5q0 .225.138.363T10.55 6t.363-.137t.137-.363v-.95q.9.525 1.45 1.425T13.05 8h.25q.225 0 .363.138t.137.362t-.137.363T13.3 9h-.25q0 1.65-1.175 2.825T9.05 13m0-2q.825 0 1.413-.587T11.05 9h-4q0 .825.588 1.413T9.05 11m7.5 4l-.15-.75q-.15-.05-.287-.112t-.263-.188l-.7.25l-.5-.9l.55-.5v-.6l-.55-.5l.5-.9l.7.25q.1-.1.25-.175t.3-.125l.15-.75h1l.15.75q.15.05.3.125t.25.175l.7-.25l.5.9l-.55.5v.6l.55.5l-.5.9l-.7-.25q-.125.125-.262.188t-.288.112l-.15.75zm.5-1.75q.3 0 .525-.225t.225-.525t-.225-.525t-.525-.225t-.525.225t-.225.525t.225.525t.525.225m1.8-3.25l-.2-1.05q-.225-.075-.412-.187T17.9 8.5l-1.05.35l-.7-1.2l.85-.75q-.05-.125-.05-.2v-.4q0-.075.05-.2l-.85-.75l.7-1.2l1.05.35q.15-.15.338-.263t.412-.187l.2-1.05h1.4l.2 1.05q.225.075.413.188t.337.262l1.05-.35l.7 1.2l-.85.75q.05.125.05.2v.4q0 .075-.05.2l.85.75l-.7 1.2l-1.05-.35q-.15.15-.337.263t-.413.187l-.2 1.05zm.7-2.25q.525 0 .888-.363T20.8 6.5t-.363-.888t-.887-.362t-.888.363t-.362.887t.363.888t.887.362" /></svg>, name: "Engineering" },
    ];
    const categoryRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={categoryRef} className=" md:-mt-36 h-full bg-[#F6F6F6] p-10" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {/* title */}
            <h1 className=" sm:mt-20 text-3xl font-semibold text-center">Browse By Categories</h1>
            <p className="text-base text-center pt-3">
                Find the job that’s perfect for you! Over 600+ new jobs every day.
            </p>

            {/* category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 max-w-6xl mx-auto">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="bg-white p-2 cursor-pointer rounded-lg shadow-md flex  gap-8 justify-start  hover:shadow-lg transition"
                    >
                        <div className="w-12 h-12 ml-3 text-white rounded-md bg-orange-600">{category.icon}</div>
                        <div className="mt-3 ml-5 text-lg font-medium">{category.name}</div>
                    </div>
                ))}
            </div>

            {/* booting poster */}

            <div className="bg-white flex gap-7 max-w-6xl p-5 pl-18 h-50 shadow-lg rounded-lg mt-30 ml-24 ">
                <img className="w-40 h-40" src={HiringImage} alt="" />
                <div className="p-2 mt-5">
                    <p className="text-2xl text-[#7D7D7D] font-normal">we are</p>
                    <h1 className="font-semibold text-7xl">HIRING</h1>
                </div>
                <div className="p-6 mt-8 ml-15">
                    <h1  className=" text-[#7D7D7D] text-lg">Let’s <b className="text-black"> work</b> Together <br />&  <b className="text-black">Explore</b>  Opportunities</h1>
                </div>
                <button className="bg-orange-600 text-white font-bold w-fit h-fit p-3.5 rounded-lg mt-14 ml-20 cursor-pointer"> Apply Now</button>
            </div>
        </div>
    );
};

export default Category;
