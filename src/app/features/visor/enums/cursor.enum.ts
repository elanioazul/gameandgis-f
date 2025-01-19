export enum CursorStyle {
  zoomIn = 'zoom-in',
  zoomOut = 'zoom-out',
  default = 'default',
  pointer = 'pointer',
  polygonbase64 = 'data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEcSURBVDhPYxQzSzBiZGBoZGBgkAFiSsGL/wwMuYziZgkbgRw/iBhVwA6QoeeBDAPGfwy6QPoDWJg8IPKfiQFk1gUWCB8MPrw4s+AJlI0CgBYrA6lQRgbG2S9OzX8LEUUFEiYJUBYDAxOUJgRsgLjhP8P/IAgXPyDKUGBErgJSrkB6HUQEPyDK0H8MDObAWJUG0rJQIbyAWJfaA/FyIPaHCuEFxIYpSWBADQX6HIXGC4af9x8A8QEoTRAg532l/4wMryHCpAPG/wwSwLx/G8i8ADcUiOOBuAmI2YGYXCABxDuQvT8NiMWBmIMCfBWIO5Bd+gOIJ748taACSFMEkF3aCczfDVA2ZQDo0uNA3AHlUgUwAV03k2ouBAMGBgAvJz6ic883fgAAAABJRU5ErkJggg==',
  polygoninfo = 'url(' + polygonbase64 + ') 0 21,auto',
}