/* FilebrowserController.java

 {{IS_NOTE
 Purpose:
 
 Description:
 
 History:
 Thu Nov 18 14:07:45     2010, Created by Jimmy Shiau
 }}IS_NOTE

 Copyright (C) 2009 Potix Corporation. All Rights Reserved.

 {{IS_RIGHT
 }}IS_RIGHT
 */
package org.zkforge.ckez;
import java.io.File;
/**
 * 
 * @author Jimmy Shiau
 */
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.zkoss.io.Files;
import org.zkoss.lang.Strings;
import org.zkoss.util.media.Media;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.UiException;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventListener;
import org.zkoss.zk.ui.event.UploadEvent;
import org.zkoss.zk.ui.util.GenericForwardComposer;
import org.zkoss.zul.Button;
import org.zkoss.zul.DefaultTreeModel;
import org.zkoss.zul.DefaultTreeNode;
import org.zkoss.zul.Div;
import org.zkoss.zul.Fileupload;
import org.zkoss.zul.Toolbarbutton;
import org.zkoss.zul.Tree;
import org.zkoss.zul.Treeitem;
import org.zkoss.zul.TreeitemRenderer;

public class FilebrowserController extends GenericForwardComposer {
	
	private static final String[] EXCLUDE_FOLDERS = {"WEB-INF","META-INF"};
	private static final String[] EXCLUDE_FILES = {};
	private static final String[] IMAGES = {"gif","jpg","jpeg","png"};
	private static final String[] FILES = {"htm", "html", "php", "php3", "pdf", "doc", "docx", "xls", "xlsx",
											"php5", "phtml", "asp", "aspx", 
											"ascx", "jsp", "cfm", "cfc", "pl", 
											"bat", "exe", "dll", "reg", "cgi", "asmx"};
	private static final String[] FLASH = {"swf"};
	private static final String[] MEDIA = {"swf", "fla", "jpg", "gif", "jpeg", "png", "avi", "mpg", "mpeg", "mp4", "WebM", "flv"}; 
	
	private String type = "";
	private String selectFolder = "";
	private Map fileFilterMap;
	private Treeitem selectedItem;
	
	private Tree tree;
	private Div cntDiv;
	private Button testUpload;
	private Toolbarbutton selBtn;
	
	
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		
		type = ((String[])param.get("Type"))[0];
		fileFilterMap = initFileFilterMap();
		
		String url = ((String[]) param.get("url"))[0];
		if (Strings.isBlank(url)) return;
		
		url = getFolderUrl(url);
		
		Map rootFolderMap = new TreeMap();
		Map map = new TreeMap();
		rootFolderMap.put(url, map);
		
		parseFolders(url, map);
		
		tree.setItemRenderer(new ExplorerTreeitemRenderer());
		tree.setModel(new DefaultTreeModel(new DefaultTreeNode("ROOT",initTreeModel(rootFolderMap, new ArrayList()))));
	}
	
	public void onUpload$testUpload(UploadEvent event) throws Exception {
		Media media = event.getMedia();
		String filePath = getFolderUpload() + media.getName();
		File file = new File(filePath);
		Files.copy(file, media.getStreamData());
		cntDiv.getChildren().clear();
		Map map = parseFolders(selectFolder, new TreeMap());
		showImages(map);
	}
	
	public void onSelect$tree(){
		cntDiv.getChildren().clear();
		selectedItem = tree.getSelectedItem();
		Treeitem item = selectedItem;;
		Map map = (Map)item.getValue();	
		selectFolder = item.getLabel() + "/";
		while (item.getParentItem() != null) {
			item = item.getParentItem();
			selectFolder = item.getLabel() + "/" + selectFolder;
		}
		showImages(map);
	}
	

	/*package*/ static String getFolderUrl(String url) {
//		int index = url.lastIndexOf(";jsessionid");
//		if (index > 0)
//			url = url.substring(0, index);
		
		if (url.startsWith("./"))
			url = url.substring(1);
		
		if (!url.startsWith("/"))
			url = "/" + url;
		return url;
	}

	private List initTreeModel(Map parentFolderMap, List list) {
		for (Iterator it = parentFolderMap.entrySet().iterator(); it.hasNext();) {
			Map.Entry entry = (Map.Entry)it.next();
			Object value = entry.getValue();
			
			if (value instanceof Map)
				list.add(new DefaultTreeNode(entry, initTreeModel((Map) value, new ArrayList())));
		}
		return list;
	}
	
	private Map parseFolders(String path, Map parentFolderMap) {
		//System.out.println("parseFolders: " + parentFolderMap);
		String _path = path;
		if (!path.endsWith("/")) {
		     _path += "/";
		}
		java.util.Set<String> paths = new java.util.HashSet<String>();
		
		String filestore = org.zkoss.util.resource.Labels.getLabel("filestore.root");
		String filepath = filestore + path;
		//System.out.println("filepath: " + filepath);
		for (java.io.File file : new java.io.File(filepath).listFiles()) {
			//System.out.println("fileName: " + file.getName());
		     paths.add(path + file.getName() + (file.isDirectory() ? "/" : ""));
		}

		                
		Iterator it = paths.iterator();
		while (it.hasNext()) {
			String pagePath = String.valueOf(it.next());
			if (pagePath.endsWith("/")) {
				String folderName = pagePath.substring(0, pagePath.length() - 1);
				folderName = folderName.substring(folderName.lastIndexOf("/") + 1);
				//if (shallShowFolder(folderName))
					parentFolderMap.put(folderName, parseFolders(pagePath, new TreeMap()));
			} else {
				String fileName = pagePath.substring(pagePath.lastIndexOf("/") + 1);
				String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
				if (shallShowFile(fileName) || shallShowFile(extension))
					parentFolderMap.put(fileName, pagePath);
			}
		}
		return parentFolderMap;
	}
	
	
	
	private boolean shallShowFolder(String folderName) {
		Object obj = fileFilterMap.get(folderName);
		return (obj == null) ? true : Boolean.valueOf((String) obj).booleanValue();
	}
	
	private boolean shallShowFile(String folderName) {
		// B70-CKEZ-22: Ignore file extension case.
		return Boolean.valueOf((String) fileFilterMap.get(folderName.toLowerCase())).booleanValue();
	}
	
	private Map initFileFilterMap() {
		Map fileFilterMap = new HashMap();
		
		for (int i = 0, j = EXCLUDE_FOLDERS.length; i < j; i++)
			fileFilterMap.put(EXCLUDE_FOLDERS[i], "false");
		for (int i = 0, j = EXCLUDE_FILES.length; i < j; i++)
			fileFilterMap.put(EXCLUDE_FILES[i], "false");		
		
		if (type.equals("Flash"))
			for (int i = 0, j = FLASH.length; i < j; i++)
				fileFilterMap.put(FLASH[i], "true");
		else if (type.equals("Images"))
			for (int i = 0, j = IMAGES.length; i < j; i++)
				fileFilterMap.put(IMAGES[i], "true");
		else if (type.equals("Files")) {
			for (int i = 0, j = FLASH.length; i < j; i++)
				fileFilterMap.put(FLASH[i], "true");
			for (int i = 0, j = MEDIA.length; i < j; i++)
				fileFilterMap.put(MEDIA[i], "true");
			for (int i = 0, j = IMAGES.length; i < j; i++)
				fileFilterMap.put(IMAGES[i], "true");
			for (int i = 0, j = FILES.length; i < j; i++)
				fileFilterMap.put(FILES[i], "true");
		}
		
		return fileFilterMap;
	}
	

	
	
	private String getFolderUpload() {
		String filestore = org.zkoss.util.resource.Labels.getLabel("filestore.root");
		String filefolder = org.zkoss.util.resource.Labels.getLabel("filestore.folder");
		if (selectFolder.equals("")) {
			return filestore + filefolder + "/";
		}
		return filestore + selectFolder;
	}
	
	
	private void showImages(Map map) {
		StringBuilder url = new StringBuilder();
		javax.servlet.http.HttpServletRequest req = (javax.servlet.http.HttpServletRequest) org.zkoss.zk.ui.Executions.getCurrent()
		                                .getNativeRequest();
		url.append(req.getScheme()).append("://").append(req.getServerName());
		if ((req.getServerPort() != 80) && (req.getServerPort() != 443)) {
		    url.append(":").append(req.getServerPort());
		}

		for (Iterator it = map.entrySet().iterator(); it.hasNext();) {
			Map.Entry me = (Map.Entry) it.next();
			Object value = me.getValue();
			if (value instanceof Map) continue;
			String path = String.valueOf(value);
			String ortherPath = "";
			if (path.endsWith("swf")) {
				ortherPath = "~./ckez/img/flashIcon.jpg";
			} else if (path.endsWith("doc") || path.endsWith("docx")) {
				ortherPath = "~./ckez/img/file_doc.png";
			} else if (path.endsWith("xls") || path.endsWith("xlsx")) {
				ortherPath = "~./ckez/img/file_xls.png";
			} else if (path.endsWith("ppt") || path.endsWith("pptx")) {
				ortherPath = "~./ckez/img/file_ppt.png";
			} else if (path.endsWith("pdf")) {
				ortherPath = "~./ckez/img/file_pdf.png";
			} else if (path.endsWith("rar") || path.endsWith("zip")) {
				ortherPath = "~./ckez/img/file_rar.png";
			} else if (path.endsWith("mp4")) {
				ortherPath = "~./ckez/img/file_mp4.png";
			} else if (path.endsWith("avi") || path.endsWith("mpg") || path.endsWith("mpeg") 
					|| path.endsWith("WebM") || path.endsWith("flv")) {
				ortherPath = "~./ckez/img/file_video.png";
			} 
			Toolbarbutton tb = new Toolbarbutton(String.valueOf(me.getKey()), "".equals(ortherPath)? url+ path: ortherPath);
			tb.addEventListener("onClick", new EventListener() {
				public void onEvent(Event event) throws Exception {
					if (selBtn !=null)
						selBtn.setSclass(null);
					selBtn = (Toolbarbutton) event.getTarget();
					selBtn.setSclass("sel");
				}
			});
			
			int CKEditorFuncNum = 1;
			CKEditorFuncNum = new Integer(((String[])param.get("CKEditorFuncNum"))[0]).intValue();
			String script = "window.opener.CKEDITOR.tools.callFunction("+
				CKEditorFuncNum+", '" + execution.encodeURL(path) + "'); window.close(); ";
			tb.setWidgetListener("onDoubleClick",script);
			
			tb.setStyle("width:110px; border:1px solid #e3e3e3; padding:1px; overflow: hidden");
			String filename = path.substring(path.lastIndexOf("/")+1, path.length());
			tb.setTooltiptext(filename);
			cntDiv.appendChild(tb);
		}
		
	}
	
	private class ExplorerTreeitemRenderer implements TreeitemRenderer {
		public void render(Treeitem item, Object data) throws Exception {
			Map.Entry entry = (Map.Entry)((DefaultTreeNode)data).getData();
			item.setLabel(String.valueOf(entry.getKey()));
			Object value = entry.getValue();
			item.setValue(value);
			item.setOpen(true);
			if (item.getParentItem() == null)
				item.setSelected(true);
		}

		public void render(Treeitem item, Object data, int index)
				throws Exception {
			render(item, data);
		}
	}
}