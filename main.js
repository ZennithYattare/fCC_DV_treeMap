/** @format */

import "./style.css";
import { treeMap } from "./treeMap";

document.querySelector("#app").innerHTML = `
<div class="bg-[#242424] flex h-screen w-screen place-items-center">
<div class="min-w-[990px] w-[990px] h-[860px] border-4 border-t-slate-200 border-l-slate-200 border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] shadow-[5px_5px_5px_black] mx-auto p-4">
  <heading>
    <h1 id="title" class="text-3xl mx-auto w-max">Video Game Sales</h1>
    <h3 id="description" class="mx-auto w-max">
      Most Sold Games on Each Platform
    </h3>
  </heading>
  <div id="tree-map" class="m-0 p-0"></div>
  <div id="legend" class="m-0 p-0"></div>
</div>
</div>
`;

treeMap(document.querySelector("#tree-map"));
