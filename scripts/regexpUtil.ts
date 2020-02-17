import escapeStringRegexp from 'escape-string-regexp'

export const absolutePathWithoutDomainRegExp = /^\/[^/]/
const contentPathPrefix = escapeStringRegexp(`${process.env.URL!}`)
export const urlPrefixRegExp = new RegExp(`^${contentPathPrefix}`)
export const httpRegExp = /^http:\/\//
