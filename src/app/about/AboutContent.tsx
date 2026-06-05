import React from "react";

export default function AboutContent() {
    return (
        <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <h1 className="font-headline-md text-headline-md text-primary dark:text-white mb-4">
                About GlobeTrek
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-white/80 max-w-3xl">
                GlobeTrek is the world&apos;s smartest travel meta-search engine. We compare
                over 100+ travel sites in seconds to find you the absolute lowest prices on
                flights, hotels, and holiday packages.
            </p>
        </div>
    );
}