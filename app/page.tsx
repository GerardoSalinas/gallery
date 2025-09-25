'use client';
import { gsap } from "gsap";
import { SplitText, ScrollSmoother, ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { useEffect } from "react";
import MasonryGrid from "./components/masonryGrid/MasonryGrid";


/*
  TODO:
  [ ] Darle animación a la imagen de perfil
  [ ] Animar el scroll de las imagenes
  [ ] Agregar descripción sobre el cliente
  [ ] Implementar suspense correctamente
*/


export default function Home() {

  const gsapAnimation = () => {
    gsap.registerPlugin(SplitText, ScrollTrigger, ScrollSmoother);

    let split = SplitText.create(".name",{
      type: "chars"
    });

    gsap.from(split.chars,{
      y: 100,
      autoAlpha: 0,
      stagger: 0.05
    });
  
    let smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        normalizeScroll: true
    });

  }


  useEffect(() => { gsapAnimation() }, []);

  return (
    <div id="smooth-wrapper" className="w-screen h-[200vh] px-8 py-10">
      <main id="smooth-content" className="w-full flex flex-col justify-center align-center">
        <span className="leading-none text-(length:--text-huge) text-center m-0 p-0 font-sans name" >OSWALDO</span>
        <span className="leading-none text-(length:--text-huge) text-center m-0 p-0 font-sans name" >SALINAS</span>
        <Image
          className="rounded-full z-3 aspect-square relative self-center -top-60 shadow-xl"
          src={"/avatar.png"}
          width={150}
          height={150}
          alt="Profile picture"
        />
        <MasonryGrid />
      </main>
    </div>
  );
}
