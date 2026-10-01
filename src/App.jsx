import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './index.css';

const DEFAULT_SUBJECTS_CONFIG = [
  { id: '1', name: "Toán", notebooks: ["Sách Toán", "VBT Toán", "Vở đỏ"] },
  { id: '2', name: "Tiếng Việt", notebooks: ["Sách Tiếng Việt", "VBT Tiếng Việt", "Vở Tập Viết", "Vở vàng"] },
  { id: '3', name: "Mĩ thuật", notebooks: ["Sách Mĩ thuật", "VBT Mĩ thuật"] },
  { id: '4', name: "Tiếng Anh", notebooks: ["Student Book", "Workbook"] },
  { id: '5', name: "Tin học", notebooks: ["Sách Tin học"] },
  { id: '6', name: "Tự nhiên và Xã hội", notebooks: ["Sách giáo khoa", "VBT", "Vở ghi"] },
  { id: '7', name: "Đạo đức", notebooks: ["Sách giáo khoa", "VBT", "Vở ghi"] },
  { id: '8', name: "Hoạt động trải nghiệm", notebooks: ["Sách giáo khoa", "VBT", "Vở ghi"] },
  { id: '9', name: "Thể dục", notebooks: ["Sách giáo khoa"] }
];

function getVietnameseDate() {
  const date = new Date();
  const day = date.getDay();
  const dateNum = date.getDate();
  const month = date.getMonth() + 1;

  let dayStr = "";
  switch (day) {
    case 0: dayStr = "Chủ nhật"; break;
    case 1: dayStr = "thứ Hai"; break;
    case 2: dayStr = "thứ Ba"; break;
    case 3: dayStr = "thứ Tư"; break;
    case 4: dayStr = "thứ Năm"; break;
    case 5: dayStr = "thứ Sáu"; break;
    case 6: dayStr = "thứ Bảy"; break;
  }

  return `${dayStr}, ngày ${dateNum} tháng ${month}`;
}

function KebabMenu({ options }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="kebab-container" onClick={(e) => e.stopPropagation()}>
      <button 
        className="icon-btn kebab-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Tùy chọn"
      >
        ⋮
      </button>
      {isOpen && (
        <>
          <div className="kebab-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="kebab-dropdown">
            {options.map((opt, i) => (
              <div 
                key={i} 
                className={`kebab-item ${opt.danger ? 'danger' : ''}`} 
                onClick={() => {
                  setIsOpen(false);
                  opt.onClick();
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MultiSelect({ options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      setSelected(selected.filter(i => i !== opt));
    } else {
      const newSelected = [...selected, opt];
      newSelected.sort((a, b) => a - b);
      setSelected(newSelected);
    }
  };

  const displayText = selected.length === 0 ? placeholder : selected.join(', ');

  return (
    <div className="multi-select-container" style={{ position: 'relative', flex: 1 }}>
      <div 
        className="form-control" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: 'pointer', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          paddingRight: '20px',
          backgroundPosition: 'right 4px center',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23475569\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '16px',
          color: selected.length === 0 ? '#94a3b8' : 'var(--text-main)',
          fontSize: '0.9rem',
          padding: '10px 8px',
          lineHeight: '1.4'
        }}
        title={displayText}
      >
        {displayText}
      </div>
      {isOpen && (
        <>
          <div className="kebab-overlay" onClick={() => setIsOpen(false)} data-html2canvas-ignore="true"></div>
          <div className="multi-select-dropdown" data-html2canvas-ignore="true">
            {options.map(opt => (
              <label key={opt} className="multi-select-item">
                <input 
                  type="checkbox" 
                  checked={selected.includes(opt)} 
                  onChange={() => toggleOption(opt)} 
                />
                Bài {opt}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SubjectCard({ subject, onRemove, isDefault, onSubjectChange, availableSubjects, currentSubjects }) {
  const subjectConfig = availableSubjects.find(s => s.name === subject);
  const notebooks = subjectConfig ? subjectConfig.notebooks : ["Sách giáo khoa", "VBT", "Vở ghi"];

  const [rows, setRows] = useState([{ id: Date.now() }]);
  const [otherRows, setOtherRows] = useState([{ id: Date.now(), type: "" }]);

  const addOtherRow = () => {
    setOtherRows([...otherRows, { id: Date.now(), type: "" }]);
  };

  const removeOtherRow = (id) => {
    if (otherRows.length > 1) {
      setOtherRows(otherRows.filter(r => r.id !== id));
    }
  };

  const updateOtherRowType = (id, newType) => {
    setOtherRows(otherRows.map(r => r.id === id ? { ...r, type: newType } : r));
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now() }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  let otherOptions = [];
  if (subject === "Tiếng Việt") {
    otherOptions = ["Viết chính tả", "Sửa lỗi chính tả", "Học thuộc lòng"];
  } else if (subject === "Toán") {
    otherOptions = ["Học thuộc lòng"];
  }

  return (
    <div className="subject-card">
      <div className="subject-header">
        {isDefault ? (
          <h2 className="subject-title">{subject}</h2>
        ) : (
          <select 
            className="subject-title-select" 
            value={subject || ""} 
            onChange={(e) => {
              onSubjectChange && onSubjectChange(e.target.value);
              setRows([{ id: Date.now() }]);
              setOtherRows([{ id: Date.now(), type: "" }]);
            }}
          >
            <option value="" disabled>-- Chọn môn học --</option>
            {availableSubjects
              .filter(subj => subj.name === subject || !currentSubjects.includes(subj.name))
              .map(subj => (
              <option key={subj.id} value={subj.name}>{subj.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          <div style={{ flex: 2 }}>Vở gì?</div>
          <div style={{ flex: 1 }}>Bài số</div>
          <div style={{ flex: 1 }}>Trang</div>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="task-row">
            <select className="form-control notebook-select" defaultValue="">
              <option value="" disabled>Vở</option>
              {notebooks.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>

            <MultiSelect 
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} 
              placeholder="Bài..." 
            />

            <input 
              type="number" 
              className="form-control" 
              placeholder="Trang" 
              min="1"
            />

            {rows.length > 1 && (
              <button className="icon-btn delete-btn" style={{ padding: '4px' }} data-html2canvas-ignore="true" onClick={() => removeRow(row.id)}>
                ✖
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="add-row-container" data-html2canvas-ignore="true">
        <button className="round-btn" onClick={addRow} title="Thêm vở/bài tập">
          +
        </button>
      </div>

      <div className="form-group other-task-group">
        <label>Bài tập khác:</label>
        
        {otherRows.map((row) => (
          <div key={row.id} style={{ marginBottom: '12px' }}>
            <div className="task-row" style={{ marginBottom: '8px' }}>
              <select className="form-control notebook-select" defaultValue="">
                <option value="" disabled>Vở</option>
                {notebooks.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>

              {otherOptions.length > 0 && (
                <select 
                  className="form-control" 
                  value={row.type} 
                  onChange={(e) => updateOtherRowType(row.id, e.target.value)}
                  style={{ flex: 2 }}
                >
                  <option value="">-- Chọn --</option>
                  {otherOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              
              {otherRows.length > 1 && (
                <button className="icon-btn delete-btn" style={{ padding: '4px' }} data-html2canvas-ignore="true" onClick={() => removeOtherRow(row.id)}>
                  ✖
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              <textarea 
                className="form-control" 
                placeholder="Nhập yêu cầu bài tập..." 
                rows="1"
                style={{ flex: 1, resize: 'none', overflow: 'hidden' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = (e.target.scrollHeight + 4) + 'px';
                }}
              ></textarea>
              {otherRows.length > 1 && <div style={{ width: '28px' }}></div>}
            </div>
          </div>
        ))}

        <div className="add-row-container" data-html2canvas-ignore="true" style={{ marginTop: '8px', marginBottom: 0 }}>
          <button className="round-btn" onClick={addOtherRow} title="Thêm bài tập khác">
            +
          </button>
        </div>
      </div>

      {!isDefault && (
        <button className="remove-btn" data-html2canvas-ignore="true" onClick={onRemove} style={{ marginTop: '16px' }}>
          Xóa môn này
        </button>
      )}
    </div>
  );
}

function SettingsTab({ availableSubjects, setAvailableSubjects }) {
  const [expandedId, setExpandedId] = useState(null);
  
  const addSubject = () => {
    const name = prompt("Nhập tên môn học mới:");
    if (name) {
      setAvailableSubjects([...availableSubjects, { id: Date.now().toString(), name, notebooks: ["Sách giáo khoa", "VBT"] }]);
    }
  };

  const renameSubject = (id, oldName) => {
    const name = prompt("Đổi tên môn học:", oldName);
    if (name && name !== oldName) {
      setAvailableSubjects(availableSubjects.map(s => s.id === id ? { ...s, name } : s));
    }
  };

  const deleteSubject = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa môn này không?")) {
      setAvailableSubjects(availableSubjects.filter(s => s.id !== id));
    }
  };

  const addNotebook = (subjectId) => {
    const name = prompt("Nhập tên vở mới:");
    if (name) {
      setAvailableSubjects(availableSubjects.map(s => {
        if (s.id === subjectId) return { ...s, notebooks: [...s.notebooks, name] };
        return s;
      }));
    }
  };

  const renameNotebook = (subjectId, index, oldName) => {
    const name = prompt("Đổi tên vở:", oldName);
    if (name && name !== oldName) {
      setAvailableSubjects(availableSubjects.map(s => {
        if (s.id === subjectId) {
          const newNotebooks = [...s.notebooks];
          newNotebooks[index] = name;
          return { ...s, notebooks: newNotebooks };
        }
        return s;
      }));
    }
  };

  const deleteNotebook = (subjectId, index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vở này không?")) {
      setAvailableSubjects(availableSubjects.map(s => {
        if (s.id === subjectId) {
          const newNotebooks = s.notebooks.filter((_, i) => i !== index);
          return { ...s, notebooks: newNotebooks };
        }
        return s;
      }));
    }
  };

  return (
    <div className="settings-container">
      <h2 className="page-title" style={{ marginTop: '20px' }}>Quản lý Môn Học & Vở</h2>
      <button className="btn-primary" onClick={addSubject}>+ Thêm môn học</button>
      
      <div className="settings-list">
        {availableSubjects.map(subj => (
          <div key={subj.id} className="settings-item">
            <div className="settings-item-header" onClick={() => setExpandedId(expandedId === subj.id ? null : subj.id)}>
              <span className="settings-item-title">{subj.name}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="expand-icon">{expandedId === subj.id ? '▼' : '▶'}</span>
                <div style={{ width: '12px' }}></div>
                <KebabMenu options={[
                  { label: "Sửa tên", onClick: () => renameSubject(subj.id, subj.name) },
                  { label: "Thêm loại vở", onClick: () => { setExpandedId(subj.id); addNotebook(subj.id); } },
                  { label: "Xóa", danger: true, onClick: () => deleteSubject(subj.id) }
                ]} />
              </div>
            </div>
            
            {expandedId === subj.id && (
              <div className="settings-sublist">
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {subj.notebooks.map((nb, idx) => (
                    <li key={idx} className="sublist-item">
                      <span style={{ fontWeight: 600 }}>{nb}</span>
                      <KebabMenu options={[
                        { label: "Sửa", onClick: () => renameNotebook(subj.id, idx, nb) },
                        { label: "Xóa", danger: true, onClick: () => deleteNotebook(subj.id, idx) }
                      ]} />
                    </li>
                  ))}
                  {subj.notebooks.length === 0 && <li className="empty-text">Chưa có vở nào.</li>}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('homework');
  
  const [availableSubjects, setAvailableSubjects] = useState(() => {
    const saved = localStorage.getItem('homework_app_subjects');
    if (saved) {
      try { 
        let parsed = JSON.parse(saved);
        // Tự động cập nhật chữ "Vở bài tập" thành "VBT" và thêm "Vở Tập Viết" cho Tiếng Việt
        parsed = parsed.map(s => {
          let newNotebooks = s.notebooks.map(nb => nb.replace(/Vở bài tập/g, "VBT"));
          if (s.name === "Tiếng Việt" && !newNotebooks.includes("Vở Tập Viết")) {
            const yellowIdx = newNotebooks.indexOf("Vở vàng");
            if (yellowIdx > -1) {
              newNotebooks.splice(yellowIdx, 0, "Vở Tập Viết");
            } else {
              newNotebooks.push("Vở Tập Viết");
            }
          }
          return { ...s, notebooks: newNotebooks };
        });
        return parsed;
      } catch (e) { console.error(e); }
    }
    return DEFAULT_SUBJECTS_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('homework_app_subjects', JSON.stringify(availableSubjects));
  }, [availableSubjects]);

  const [subjects, setSubjects] = useState([
    { id: 'toan', name: 'Toán', isDefault: true },
    { id: 'tiengviet', name: 'Tiếng Việt', isDefault: true }
  ]);

  const handleAddSubject = () => {
    setSubjects([...subjects, { id: Date.now().toString(), name: "", isDefault: false }]);
  };

  const updateSubjectName = (id, newName) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const isHomeworkTab = activeTab === 'homework';
  const containerClass = isHomeworkTab ? 'bg-cream' : 'bg-settings';

  return (
    <div className={containerClass} style={{ minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <div className="tabs">
        <button 
          className={`tab-btn ${isHomeworkTab ? 'active' : ''}`}
          onClick={() => setActiveTab('homework')}
        >
          Báo bài tập
        </button>
        <button 
          className={`tab-btn ${!isHomeworkTab ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Cài đặt
        </button>
      </div>

      <div className="tab-content">
        {isHomeworkTab ? (
          <div style={{ position: 'relative' }}>
            <div id="homework-capture" style={{ padding: '16px', margin: '-16px', backgroundColor: 'var(--bg-cream)' }}>
              <h1 className="page-title">
                Bài tập về nhà<br/>{getVietnameseDate()}
              </h1>

              {subjects.map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject.name} 
                  isDefault={subject.isDefault}
                  onRemove={() => removeSubject(subject.id)}
                  onSubjectChange={(newName) => updateSubjectName(subject.id, newName)}
                  availableSubjects={availableSubjects}
                  currentSubjects={subjects.map(s => s.name)}
                />
              ))}

              <div style={{ marginTop: '12px', fontStyle: 'italic', fontSize: '0.9rem', color: '#64748b', padding: '0 8px', fontWeight: 600 }}>
                *Từ ngữ viết tắt:<br/>
                VBT: Vở Bài Tập
              </div>

              <div className="add-btn-container" data-html2canvas-ignore="true">
                <button 
                  className="btn-round"
                  onClick={handleAddSubject}
                  title="Thêm môn học khác"
                >
                  +
                </button>
              </div>
            </div>

            <div data-html2canvas-ignore="true" style={{ marginTop: '30px', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <button 
                className="btn-primary" 
                style={{ backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', maxWidth: '80%' }}
                onClick={() => {
                  const el = document.getElementById('homework-capture');
                  if (el) {
                    html2canvas(el, { 
                      backgroundColor: '#fdfbf7', 
                      scale: 2,
                      onclone: (clonedDoc) => {
                        // Ẩn mũi tên của mục Bài số (MultiSelect) và các dropdown khác khi xuất ảnh
                        const controls = clonedDoc.querySelectorAll('.multi-select-container .form-control, select.form-control');
                        controls.forEach(c => c.style.backgroundImage = 'none');
                      }
                    }).then(canvas => {
                      const link = document.createElement('a');
                      link.download = `Bao_bai_tap_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.png`;
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    });
                  }
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>📸</span> Xuất ảnh gửi Zalo
              </button>
            </div>
          </div>
        ) : (
          <SettingsTab 
            availableSubjects={availableSubjects} 
            setAvailableSubjects={setAvailableSubjects} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
