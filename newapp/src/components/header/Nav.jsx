import React from 'react'
import BuyProperty from '../../pages/BuyProperty'
import RentProperty from '../../pages/RentProperty'
import EnlistProperty from '../../pages/EnlistProperty'
// Initialization for ES Users
import {
    Tab,
    initTE,
  } from "tw-elements";
  
initTE({ Tab });

const Nav = () => {
  return (
    <div>
<ul
  class="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
  role="tablist"
  data-te-nav-ref>
  <li role="presentation">
    <a
      href="#tabs-home"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-home"
      data-te-nav-active
      role="tab"
      aria-controls="tabs-home"
      aria-selected="true"
      >Buy</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-profile"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-profile"
      role="tab"
      aria-controls="tabs-profile"
      aria-selected="false"
      >Rent</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-messages"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-messages"
      role="tab"
      aria-controls="tabs-messages"
      aria-selected="false"
      >Enlist</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-contact"
      class="disabled pointer-events-none my-2 block border-x-0 border-b-2 border-t-0 border-transparent bg-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-400 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent dark:text-neutral-600"
      data-te-toggle="pill"
      data-te-target="#tabs-contact"
      role="tab"
      aria-controls="tabs-contact"
      aria-selected="false"
      >Dashboard</a
    >
  </li>
</ul>
<div class="mb-6">
  <div
    class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-home"
    role="tabpanel"
    aria-labelledby="tabs-home-tab"
    data-te-tab-active>
    <BuyProperty />
  </div>
  <div
    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-profile"
    role="tabpanel"
    aria-labelledby="tabs-profile-tab">
    <RentProperty />
  </div>
  <div
    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-messages"
    role="tabpanel"
    aria-labelledby="tabs-profile-tab">
    <EnlistProperty />
  </div>
  <div
    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-contact"
    role="tabpanel"
    aria-labelledby="tabs-contact-tab">
    Dashboard
  </div>
</div>
    </div>
  )
}

export default Nav