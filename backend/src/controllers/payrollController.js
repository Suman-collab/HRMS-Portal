import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';

export const getPayroll = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    let payroll = await Payroll.findOne({ employeeId }).lean();
    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { basicSalary, allowances, deductions } = req.body;

    if (Number(basicSalary) < 0 || Number(allowances) < 0 || Number(deductions) < 0) {
      return res.status(400).json({ success: false, message: 'Negative values not allowed' });
    }

    let payroll = await Payroll.findOne({ employeeId });
    if (!payroll) {
      payroll = new Payroll({ employeeId });
    }

    payroll.basicSalary = basicSalary;
    payroll.allowances = allowances;
    payroll.deductions = deductions;
    // pre-save hook calculates netSalary
    await payroll.save();

    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadSalarySlip = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const payroll = await Payroll.findOne({ employeeId }).populate('employeeId', 'employeeId email role');
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll data not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-disposition', `attachment; filename=Salary_Slip_${payroll.employeeId.employeeId}.pdf`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(20).text('Salary Slip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Employee ID: ${payroll.employeeId.employeeId}`);
    doc.text(`Email: ${payroll.employeeId.email}`);
    doc.moveDown();
    doc.text(`Basic Salary: $${payroll.basicSalary}`);
    doc.text(`Allowances: $${payroll.allowances}`);
    doc.text(`Deductions: $${payroll.deductions}`);
    doc.moveDown();
    doc.fontSize(14).text(`Net Salary: $${payroll.netSalary}`, { underline: true });
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};