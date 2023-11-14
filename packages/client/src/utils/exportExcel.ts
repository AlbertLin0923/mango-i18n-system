import * as Excel from 'exceljs'
import * as FileSaver from 'file-saver'

const setSheetStyle = (sheet: any, localeDictWithLabel: string[]) => {
  sheet.columns = localeDictWithLabel.map((i) => {
    return {
      header: i,
      width: 60,
    }
  })

  // 设置每一列样式
  const row = sheet.getRow(1)

  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '9cbb5e' },
  }
  row.height = 30
  row.eachCell((cell: any) => {
    cell.border = {
      top: { style: 'thin', color: { argb: '000' } },
      left: { style: 'thin', color: { argb: '000' } },
      bottom: { style: 'thin', color: { argb: '000' } },
      right: { style: 'thin', color: { argb: '000' } },
    }
  })

  row.eachCell((cell: any, rowNumber: any) => {
    sheet.getColumn(rowNumber).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }
  })
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
}

const exportExcel = (
  table: any,
  fileName: string = '翻译文案',
  localeDictWithLabel: any[],
) => {
  const data = table.map((item: any) => {
    return localeDictWithLabel.map((key) => {
      return item[key]
    })
  })
  const workbook = new Excel.Workbook()
  const sheet = workbook.addWorksheet('翻译')

  setSheetStyle(sheet, localeDictWithLabel)
  sheet.addRows(data)

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    FileSaver.saveAs(blob, fileName)
  })
}

export { exportExcel }
