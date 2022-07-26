# swissbiopics-visualizer

Custom HTMLElement for visualizing subcellular locations using [SwissBioPics](https://www.swissbiopics.org), an expert curated library of interactive cell images.

This web component uses the SwissBioPics API to automatically select the most appropriate image for a given organism and a list of subcellular locations and highlight those locations on the image.


## Attributes

| Attribute name | Value |
| ---------------|----------|
| taxid          | [NCBI taxonomy identifier](https://www.ncbi.nlm.nih.gov/taxonomy/) of the organism. |
| sls            | List of comma-separated [UniProtKB subcellular locations (SL)](https://www.uniprot.org/locations/) IDs. The IDs can be given without the 'SL-' prefix and leading '0's. |
| gos            | List of comma-separated [Gene Ontology (GO)](http://geneontology.org/) cellular component IDs. These will be [mapped](http://current.geneontology.org/ontology/external2go/uniprotkb_sl2go) to UniProtKB subcellular location IDs before showing. |
| styleid        | Optional template ID to use an alternative style (see [Customize style](#customize-style)). The default value is `sibSwissBioPicsStyle`. |

## Installation

```javascript
npm install --save-prod @swissprot/swissbiopics-visualizer
```

## Import in your application

```javascript
import '@swissprot/swissbiopics-visualizer';
```


## Basic usage

In the web page where you want to display a SwissBioPics image, add the location of the SwissBioPics Java Script module with one of these two options:

1. your local dependency path if you [installed](#installation) and [imported](#import-in-your-application) the module, e.g.:
```html
<script type="module" src="swissprot/swissbiopics.js"></script>
```

2. the [SwissBioPics](https://www.swissbiopics.org) website if you did not install the module:
```html
<script type="module" src="https://www.swissbiopics.org/static/swissbiopics.js"></script>
```

Then add a template for the layout of the sidebar (see [Customize sidebar](#customize-sidebar) for alternative layouts):
```html
<!-- Display sidebar with list items -->
<template id="sibSwissBioPicsSlLiItem">
    <li class="subcellular_location">
         <a class="subcell_name"></a>
         <span class="subcell_description"></span>
    </li>
</template>
```

Now add a SwissBioPics custom element for your organism and the subcellular locations that you wish to highlight. You must provide the [NCBI taxonomy identifier](https://www.ncbi.nlm.nih.gov/taxonomy/) of the organism and a comma-separated list of the subcellular locations IDs with one of these two options:

1. Use the `sls` attribute for [UniProtKB subcellular locations (SL)](https://www.uniprot.org/locations/) IDs:
```html
<sib-swissbiopics-sl taxid="NCBI taxonomy ID" sls="list of SL IDs"></sib-swissbiopics-sl>
```

2. Use the `gos` attribute for [Gene Ontology (GO)](http://geneontology.org/) cellular component IDs:
```html
<sib-swissbiopics-sl taxid="NCBI taxonomy ID" gos="list of GO IDs"></sib-swissbiopics-sl>
```


## Customize style

You can customize the style of the image and its sidebar by adding a template with your desired style before the custom element. Here is an example:

```html
<!-- Override default style -->
<template id="sibSwissBioPicsStyle">
    <style>
        ul > li > a {
            font-style:oblique;
        }
        ul.notpresent li > .subcell_description {
            display:none;
        }
    </style>
</template>
```

You can also define different unique template IDs and use them with the `styleid` [attribute](#attributes) in the SwissBioPics custom element, e.g.:
```html
<template id="myStyle">
    ...
</template>
<sib-swissbiopics-sl taxid="NCBI taxonomy ID" sls="list of SL IDs" styleid="myStyle"></sib-swissbiopics-sl>
```
This can be useful when you have several images in one page and want to style each differently.

### Customize highlighting

The default style highlights all given subcellular locations in the same way. To highlight different locations with different colors/shades, for instance to make a heat map that reflects either quantitative or qualitative information about the locations, you must define the style for each location in the style template for the image. Defining a style for a given subcellular location works differently for [UniProtKB subcellular locations (SL)](https://www.uniprot.org/locations/) and [Gene Ontology (GO)](http://geneontology.org/) cellular component IDs. In the SVG images, SL IDs are in an `id` attribute and GO IDs in a `class` name, as shown in this example:

`<g class="subcellular_location subcell_present GO9507" id="SL0049">`

If you use SL IDs, you must strip the dash from the ID to use it as a CSS ID ('#') selector. In this example the color of SL0049 (Chloroplast) is changed to be red:
```html
<!-- Override default style of image -->
<template id="sibSwissBioPicsStyle">
    <style>
        svg #SL0049 *:not(text) {fill:red}
        svg #SL0049 *:not(path, .coloured) {opacity:0.8}
        svg #SL0049 .coloured {stroke:black}
        svg .mp_SL0049 *:not(text) {fill:red}
        svg .mp_SL0049 *:not(path, .coloured) {opacity:0.8}
        svg .mp_SL0049 .coloured {stroke:black}
        svg .part_SL0049 *:not(text) {fill:red}
        svg .part_SL0049 *:not(path, .coloured) {opacity:0.8}
        svg .part_SL0049 .coloured {stroke:black}
    </style>
</template>
```

If you use GO IDs, you must strip the leading '0's from the ID to use it as a CSS class ('.') selector:
```html
<template id="sibSwissBioPicsStyle">
    <style>
        svg .GO9507 *:not(text) {fill:red}
        svg .GO9507 *:not(path, .coloured) {opacity:0.8}
        svg .GO9507 .coloured {stroke:black}
        svg .mp_GO9507 *:not(text) {fill:red}
        svg .mp_GO9507 *:not(path, .coloured) {opacity:0.8}
        svg .mp_GO9507 .coloured {stroke:black}
        svg .part_GO9507 *:not(text) {fill:red}
        svg .part_GO9507 *:not(path, .coloured) {opacity:0.8}
        svg .part_GO9507 .coloured {stroke:black}
    </style>
</template>
```


The `.mp_` and `.part_` are used to highlight membranes (`.mp_`) or parts (`.part_`) of locations that have no SVG elements of their own in the image. For membranes and parts that have their own SVG elements the standard `id`/`class` is used to select and highlight them.

### Customize sidebar

The sidebar shows all subcellular locations that are present in the image. You can display them as list items:
```html
<!-- Display sidebar with list items -->
<template id="sibSwissBioPicsSlLiItem">
    <li class="subcellular_location">
         <a class="subcell_name"></a>
         <span class="subcell_description"></span>
    </li>
</template>
```

or table rows:
```html
<!-- Display sidebar with table rows -->
<template id="sibSwissBioPicsSlLiItem">
    <tr class="subcellular_location">
         <td><a class="subcell_name"></a></td>
         <td class="subcell_description"></td>
    </tr>
</template>
```

or any other structure that you provide. The classes `subcell_name` and `subcell_description` are mandatory and the content of these elements is filled in by the web component, which calls this template for each subcellular location that is present in the image.

Note that if you change the layout of the sidebar, you may have to adapt the style of the `sibSwissBioPicsStyle` template accordingly (see [Customize style](#customize-style)).
