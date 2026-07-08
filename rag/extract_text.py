from docling.document_converter import DocumentConverter


def convert_doc(source):
  converter = DocumentConverter()
  result = converter.convert(source)

  return result.document.export_to_dict()


result = convert_doc("docs/nutrient-solutions-for-greenhouse-crops-5th-edition.pdf")

for i in result["texts"]:
  print(i["orig"])